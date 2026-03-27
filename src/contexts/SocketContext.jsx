"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext();
const DEBUG_NOTIFICATIONS =
  process.env.NEXT_PUBLIC_DEBUG_NOTIFICATIONS === "true";

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Only connect if user is authenticated
    if (session?.user?.email) {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const newSocket = io(url, {
        transports: ["websocket"], // Use websocket transport
        forceNew: true,
      });

      newSocket.on("connect", () => {
        if (DEBUG_NOTIFICATIONS) {
          console.log("Socket connected successfully:", newSocket.id);
        }

        // Join room with email (and userId if available)
        if (session?.user?.email) {
          const emailRoom = session.user.email.toLowerCase();
          if (DEBUG_NOTIFICATIONS) {
            console.log("Joining room:", emailRoom);
          }
          newSocket.emit("join", emailRoom);
        }

        if (session?.user?._id) {
          if (DEBUG_NOTIFICATIONS) {
            console.log("Joining room:", session.user._id);
          }
          newSocket.emit("join", session.user._id);
        }

        if (session?.user?.id) {
          if (DEBUG_NOTIFICATIONS) {
            console.log("Joining room:", session.user.id);
          }
          newSocket.emit("join", session.user.id);
        }
      });

      if (DEBUG_NOTIFICATIONS) {
        newSocket.on("notification", (payload) => {
          console.log("[SocketContext] notification event", payload);
        });

        newSocket.on("negotiation_status_updated", (payload) => {
          console.log(
            "[SocketContext] negotiation_status_updated event",
            payload,
          );
        });
      }

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Disconnect if user logs out or session expires
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
