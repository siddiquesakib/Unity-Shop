"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const NotificationContext = createContext();
const DEBUG_NOTIFICATIONS =
  process.env.NEXT_PUBLIC_DEBUG_NOTIFICATIONS === "true";

export const useNotifications = () => {
  return useContext(NotificationContext);
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/notifications?email=${user.email}`,
      );
      if (Array.isArray(res.data)) {
        setNotifications((prev) => {
          // Merge: combine fetch results with any very new notifications we might have received via socket.
          const fetched = res.data;
          const existingIds = new Set(
            fetched.map((n) => n?._id?.toString?.() || n?._id),
          );
          const news = prev.filter(
            (n) => !existingIds.has(n?._id?.toString?.() || n?._id),
          );
          const combined = [...news, ...fetched];

          // Defer unread count update to avoid nested state updates.
          setTimeout(() => {
            setUnreadCount(combined.filter((n) => !n.read).length);
          }, 0);

          return combined;
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

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

    if (DEBUG_NOTIFICATIONS) {
      console.log("[NotificationContext] Socket listener attached", {
        connected: socket.connected,
        socketId: socket.id,
        userEmail: user?.email,
      });
    }

    const handleConnect = () => {
      if (DEBUG_NOTIFICATIONS) {
        console.log("[NotificationContext] Socket connected", {
          socketId: socket.id,
          userEmail: user?.email,
        });
      }

      // Re-sync on reconnect in case events were missed while offline.
      fetchNotifications();
    };

    const handleDisconnect = (reason) => {
      if (DEBUG_NOTIFICATIONS) {
        console.log("[NotificationContext] Socket disconnected", {
          reason,
          userEmail: user?.email,
        });
      }
    };

    const handleNotification = (newNotification) => {
      if (DEBUG_NOTIFICATIONS) {
        console.log("Context received notification:", newNotification);
      }

      const incomingEmail = newNotification?.email?.toLowerCase?.();
      const userEmail = user?.email?.toLowerCase?.();
      if (incomingEmail && userEmail && incomingEmail !== userEmail) {
        return;
      }

      setNotifications((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const incomingId = newNotification?._id?.toString?.();
        const isDuplicate = incomingId
          ? list.some((n) => n?._id?.toString?.() === incomingId)
          : false;

        if (isDuplicate) {
          return list;
        }

        setUnreadCount((count) => (count || 0) + 1);
        return [newNotification, ...list];
      });
    };

    const handleNegotiationStatusUpdate = (payload) => {
      if (DEBUG_NOTIFICATIONS) {
        console.log(
          "[NotificationContext] negotiation_status_updated",
          payload,
        );
      }

      // Safety net: ensure bell count/list matches DB even if one emit was missed.
      fetchNotifications();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("notification", handleNotification);
    socket.on("negotiation_status_updated", handleNegotiationStatusUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("negotiation_status_updated", handleNegotiationStatusUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user?.email]);

  // ─── Mark a single notification as read ──────────────────────────────────────────
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

      // Make the API call
      const res = await axios.patch(`${API_BASE}/notifications/${id}/read`);

      // If server returns error, revert (optional, but good practice)
      if (res.status !== 200) {
        throw new Error("Failed to mark read on server");
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert optimistic update nicely
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n)),
      );
      setUnreadCount((prev) => (prev || 0) + 1);
    }
  };

  // ─── Mark ALL as read ──────────────────────────────────────────────────────────
  const markAllAsRead = async () => {
    if (!user?.email) return;
    try {
      // Optimistic update
      const previousState = [...notifications];
      const previousCount = unreadCount;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      const res = await axios.patch(`${API_BASE}/notifications/mark-all-read`, {
        email: user.email,
      });

      if (res.status !== 200) {
        throw new Error("Failed to mark all read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      // Revert not implemented fully basically as it's complex, but assuming it works
      // Logic could be improved here
    }
  };

  // ─── Delete notification ───────────────────────────────────────────────────────
  const deleteNotification = async (id) => {
    try {
      // Check if it was unread before removing
      const wasUnread = notifications.find((n) => n._id === id && !n.read);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      await axios.delete(`${API_BASE}/notifications/${id}`);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const createNotification = async (notifData) => {
    if (!user?.email) {
      console.warn("createNotification called without user email");
      return;
    }

    // Optimistic update
    const tempId = "temp-" + Date.now();
    const newNotif = {
      _id: tempId,
      email: user.email,
      ...notifData,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => (prev || 0) + 1);

    try {
      const res = await axios.post(`${API_BASE}/notifications`, {
        email: user.email,
        ...notifData,
      });

      if (res.data && res.data._id) {
        setNotifications((currentList) => {
          // Check if the real notification (via socket) is already in the list
          const socketAdded = currentList.some((n) => n._id === res.data._id);

          if (socketAdded) {
            // Socket added the real one, so remove the temp one
            // And fix the count (since we added +1 optimistically, and socket added +1)
            setUnreadCount((c) => Math.max(0, c - 1));
            return currentList.filter((n) => n._id !== tempId);
          } else {
            // Socket hasn't added it yet, so just swap temp -> real
            return currentList.map((n) => (n._id === tempId ? res.data : n));
          }
        });
      }
    } catch (error) {
      console.error("Failed to create notification", error);
      // Rollback on error
      setNotifications((prev) => prev.filter((n) => n._id !== tempId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
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
