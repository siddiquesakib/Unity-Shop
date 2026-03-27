"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();
  const { user } = useAuth();

  useEffect(() => {
    const resolveIdentity = () => {
      const sessionEmail = session?.user?.email || "";
      const sessionUserId =
        session?.user?._id || session?.user?.id || session?.user?.userId || "";

      const authEmail = String(user?.email || "").toLowerCase();
      const authUserId = String(user?._id || user?.id || user?.userId || "");

      if (sessionEmail) {
        return {
          email: String(sessionEmail).toLowerCase(),
          userId: String(sessionUserId || ""),
        };
      }

      if (authEmail) {
        return {
          email: authEmail,
          userId: authUserId,
        };
      }

      if (typeof window === "undefined") {
        return { email: "", userId: "" };
      }

      try {
        const rawUser = localStorage.getItem("user");
        const parsed = rawUser ? JSON.parse(rawUser) : null;
        const fallbackEmail = String(parsed?.email || "").toLowerCase();
        const fallbackUserId = String(
          parsed?._id || parsed?.id || parsed?.userId || "",
        );

        return {
          email: fallbackEmail,
          userId: fallbackUserId,
        };
      } catch {
        return { email: "", userId: "" };
      }
    };

    const { email, userId } = resolveIdentity();
    const hasIdentity = Boolean(email || userId);

    if (!hasIdentity) {
      return;
    }

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const newSocket = io(url, {
      transports: ["websocket"],
      forceNew: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully:", newSocket.id);
      setSocket(newSocket);

      if (email) {
        console.log("Joining room:", email);
        newSocket.emit("join", email);
      }

      if (userId) {
        console.log("Joining room:", userId);
        newSocket.emit("join", userId);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [
    session?.user?.email,
    session?.user?._id,
    session?.user?.id,
    session?.user?.userId,
    user?.email,
    user?._id,
    user?.id,
    user?.userId,
  ]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
