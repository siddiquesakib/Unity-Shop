"use client";
import React, { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";

const NotificationListener = () => {
  const socket = useSocket();
  const { fetchCart } = useCart(); // Assuming fetchCart exists in CartContext

  useEffect(() => {
    if (!socket) return;

    // Listen for generic notifications
    socket.on("notification", (data) => {
      // Play sound if possible or just toast
      console.log("Notification received:", data);

      // Determine toast style based on type
      switch (data.type) {
        case "payment_success":
          toast.success(data.message || "Payment Successful!", {
            duration: 5000,
          });
          break;
        case "order_confirmed":
          toast.success(data.message || "Order Confirmed!", { icon: "📦" });
          break;
        case "product_approved":
          toast.success(data.message || "Product Approved!", { icon: "✅" });
          break;
        case "product_rejected":
          toast.error(data.message || "Product Rejected!", { icon: "❌" });
          break;
        case "coupon":
          toast(data.message || "New Coupon Available!", { icon: "🎟️" });
          break;
        default:
          toast(data.message || "New Notification", { icon: "🔔" });
      }
    });

    // Listen for cart updates
    socket.on("cart-updated", (data) => {
      console.log("Cart updated:", data);
      // Refresh cart context if possible
      if (fetchCart) {
        fetchCart();
      }
      toast.success(data.message || "Cart Updated", { id: "cart-update" }); // Use ID to prevent duplicates
    });

    return () => {
      socket.off("notification");
      socket.off("cart-updated");
    };
  }, [socket, fetchCart]);

  return null; // Logic only component
};

export default NotificationListener;
