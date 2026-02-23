"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SellerStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders/seller-stats?sellerEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.email]);

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-400",
    },
    {
      label: "Total Sales",
      value: stats ? `${stats.totalOrders}` : "0",
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Total Products",
      value: stats ? `${stats.totalProducts}` : "0",
      icon: Package,
      color: "from-purple-500 to-pink-400",
    },
    {
      label: "New Orders",
      value: stats ? `${stats.statusCounts?.New || 0}` : "0",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
            >
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            {loading ? (
              <div className="h-9 w-24 bg-slate-800 rounded-lg animate-pulse mt-1" />
            ) : (
              <h3 className="text-3xl font-bold text-white mt-1">
                {stat.value}
              </h3>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
