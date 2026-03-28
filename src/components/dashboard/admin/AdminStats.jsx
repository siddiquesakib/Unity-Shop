"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Store,
  DollarSign,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/orders/platform-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch admin stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white border border-gray-200 animate-pulse"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-100 mb-4" />
            <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-7 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      change: `Today: $${data.todaySales?.toLocaleString() || "0"}`,
      isPositive: (data.todaySales || 0) > 0,
      icon: DollarSign,
      color: "text-gray-900",
      bg: "bg-gray-100",
    },
    {
      title: "Total Users",
      value: data.totalUsers?.toLocaleString() || "0",
      change: `+${data.newUsersToday || 0} today`,
      isPositive: (data.newUsersToday || 0) > 0,
      icon: Users,
      color: "text-gray-900",
      bg: "bg-gray-100",
    },
    {
      title: "Active Sellers",
      value: data.totalSellers?.toLocaleString() || "0",
      change: `${data.totalProducts || 0} products`,
      isPositive: true,
      icon: Store,
      color: "text-gray-900",
      bg: "bg-gray-100",
    },
    {
      title: "Pending Verifications",
      value: data.pendingSellerRequests?.toString() || "0",
      change: `${data.totalOrders || 0} total orders`,
      isPositive: (data.pendingSellerRequests || 0) === 0,
      icon: UserCheck,
      color: "text-gray-900",
      bg: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? "text-emerald-600" : "text-red-500"}`}
            >
              {stat.change}
              {stat.isPositive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
