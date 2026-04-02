"use client";
import React, { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";

const toastOptions = {
  duration: 5000,
  position: "top-right",
};

const NotificationListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time notifications and show toasts
    const handleNotification = (data) => {
      console.log("Notification received:", data);

      switch (data.type) {
        case "cart_add":
          // Cart add toast is already shown by addToCart — skip duplicate
          break;
        case "payment_success":
          toast.success(data.message || "Payment successful!", toastOptions);
          break;
        case "order_confirmed":
          toast.success(data.message || "New order received!", toastOptions);
          break;
        case "order_status":
          toast.success(data.message || "Order status updated!", {
            icon: "📦",
            ...toastOptions,
          });
          break;
        case "seller_approved":
          toast.success(data.message || "Your seller request was approved!", {
            icon: "🎉",
            ...toastOptions,
          });
          break;
        case "seller_rejected":
          toast.error(data.message || "Your seller request was rejected.", {
            icon: "❌",
            ...toastOptions,
          });
          break;
        case "product_approved":
          toast.success(data.message || "Product Approved!", {
            icon: "✅",
            ...toastOptions,
          });
          break;
        case "product_rejected":
          toast.error(data.message || "Product Rejected!", {
            icon: "❌",
            ...toastOptions,
          });
          break;
        case "coupon":
          toast(data.message || "New Coupon Available!", {
            icon: "🎟️",
            ...toastOptions,
          });
          break;
        case "offer_accepted":
          toast.success(data.message || "Your offer was accepted!", {
            icon: "✅",
            ...toastOptions,
          });
          break;
        case "offer_rejected":
          toast.error(data.message || "Your offer was declined.", {
            icon: "❌",
            ...toastOptions,
          });
          break;
        default:
          toast(data.message || "New notification", toastOptions);
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return null; // Logic only component
};

export default NotificationListener;
