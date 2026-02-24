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

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/orders/platform-stats`)
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
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-800 mb-4" />
            <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
            <div className="h-7 w-32 bg-slate-800 rounded" />
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
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total Users",
      value: data.totalUsers?.toLocaleString() || "0",
      change: `+${data.newUsersToday || 0} today`,
      isPositive: (data.newUsersToday || 0) > 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Sellers",
      value: data.totalSellers?.toLocaleString() || "0",
      change: `${data.totalProducts || 0} products`,
      isPositive: true,
      icon: Store,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending Verifications",
      value: data.pendingSellerRequests?.toString() || "0",
      change: `${data.totalOrders || 0} total orders`,
      isPositive: (data.pendingSellerRequests || 0) === 0,
      icon: UserCheck,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
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
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? "text-emerald-400" : "text-rose-400"}`}
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
            <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
