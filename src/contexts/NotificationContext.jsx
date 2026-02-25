"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/notifications?email=${user.email}`,
      );
      if (Array.isArray(res.data)) {
        setNotifications((prev) => {
          // Merge: combine fetch results with any very new notifications we might have received via socket
          // Note: This is tricky. simpler to just set, but let's try to be smart.
          // Usually fetch is authoritative for history.
          // But if we received a notification via socket while fetching, we should keep it.
          // Since socket is mostly for "new" stuff.
          // A simple strategy: check if the first item in prev is NEWER than first item in res.
          // Or just prefer socket data if it has ID?
          // Actually, simplest fix: just trust fetch?
          // No, race condition exists.
          // Let's just blindly push? No duplicates?
          const fetched = res.data;
          const existingIds = new Set(fetched.map((n) => n._id));
          const news = prev.filter((n) => !existingIds.has(n._id));
          return [...news, ...fetched];
        });
        setUnreadCount(res.data.filter((n) => !n.read).length); // Approximate
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when user logs in
  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]); // Only re-run if email changes

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (newNotification) => {
      // Optimistically add to state
      console.log("Context received notification:", newNotification);
      setNotifications((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        // Prevent duplicate based on _id if it exists
        if (
          newNotification._id &&
          list.some((n) => n._id === newNotification._id)
        )
          return list;
        return [newNotification, ...list];
      });
      setUnreadCount((prev) => (prev || 0) + 1);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    // Only proceed if it is currently unread
    const notif = notifications.find((n) => n._id === id);
    if (notif && notif.read) return;

    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await axios.patch(`http://localhost:5000/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert if needed, but usually fine
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.email) return;
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      await axios.patch(`http://localhost:5000/notifications/mark-all-read`, {
        email: user.email,
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      // Check if it was unread before removing
      const wasUnread = notifications.find((n) => n._id === id && !n.read);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      await axios.delete(`http://localhost:5000/notifications/${id}`);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const createNotification = async (notifData) => {
    if (!user?.email) return;
    try {
      await axios.post("http://localhost:5000/notifications", {
        email: user.email,
        ...notifData,
      });
    } catch (error) {
      console.error("Failed to create notification", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
        fetchNotifications,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
