"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function SellerStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(
          `${API_BASE}/orders/seller-stats?sellerEmail=${encodeURIComponent(user.email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
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
      label: "Total Products",
      value: stats ? `${stats.totalProducts}` : "0",
      icon: Package,
    },
    {
      label: "Total Orders",
      value: stats ? `${stats.totalOrders}` : "0",
      icon: ShoppingBag,
    },
    {
      label: "Total Sales",
      value: stats ? `$${stats.totalRevenue.toFixed(2)}` : "$0.00",
      icon: DollarSign,
    },
    {
      label: "Pending Orders",
      value: stats ? `${stats.pendingCount || 0}` : "0",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="h-2 w-2 rounded-full bg-black/10 group-hover:bg-black group-hover:scale-150 transition-all duration-500"></div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              {loading ? (
                <div className="h-9 w-24 bg-gray-50 rounded-lg animate-pulse" />
              ) : (
                <h3 className="text-3xl font-black text-black tracking-tighter">
                  {stat.value}
                </h3>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
