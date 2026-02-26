"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ShoppingBag, Clock, CreditCard, Heart } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders/user-stats?customerEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.email]);

  const statCards = [
    {
      label: "Total Orders",
      value: stats ? `${stats.totalOrders}` : "0",
      icon: ShoppingBag,
      accent: "bg-gray-900 text-white",
    },
    {
      label: "Pending",
      value: stats ? `${stats.pendingCount}` : "0",
      icon: Clock,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Spent",
      value: stats ? `$${stats.totalSpent.toFixed(2)}` : "$0.00",
      icon: CreditCard,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Wishlist",
      value: stats ? `${stats.wishlistCount}` : "0",
      icon: Heart,
      accent: "bg-rose-50 text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-5 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-lg ${stat.accent} flex items-center justify-center`}
            >
              <stat.icon size={18} />
            </div>
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            )}
            <p className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
