"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Tag,
  MessageSquare,
  ArrowRight,
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ManagerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/platform-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch platform stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white border border-gray-200 animate-pulse"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const pendingOrders =
    (stats?.statusCounts?.["placed"] || 0) +
    (stats?.statusCounts?.["confirmed"] || 0) +
    (stats?.statusCounts?.["packed"] || 0);

  const panels = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      href: "/dashboard/manager/fulfillment",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      href: "/dashboard/manager/fulfillment",
    },
    {
      title: "Total Sellers",
      value: stats?.totalSellers || 0,
      icon: Users,
      href: "/dashboard/manager/sellers",
    },
    {
      title: "Revenue Overview",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      href: "/dashboard/manager/stats",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {panels.map((panel, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Link
            href={panel.href}
            className="block p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-xl bg-gray-50 text-black group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                <panel.icon size={22} strokeWidth={2.5} />
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 group-hover:text-black transition-all duration-500 transform group-hover:translate-x-1"
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{panel.title}</p>
              <h3 className="text-3xl font-black text-black tracking-tighter">
                {panel.value}
              </h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
