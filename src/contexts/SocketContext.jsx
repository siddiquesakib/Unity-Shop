"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Only connect if user is authenticated
    if (session?.user?.email) {
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket"], // Use websocket transport
        forceNew: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully:", newSocket.id);

        // Join room with email (and userId if available)
        if (session?.user?.email) {
          const emailRoom = session.user.email.toLowerCase(); // consistent casing
          console.log("Joining room:", emailRoom);
          newSocket.emit("join", emailRoom);
        }

        if (session?.user?._id) {
          console.log("Joining room:", session.user._id);
          newSocket.emit("join", session.user._id);
        }
      });

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
