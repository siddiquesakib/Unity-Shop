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
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ManagerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/platform-stats`,
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
    (stats?.statusCounts?.["New"] || 0) +
    (stats?.statusCounts?.["Processing"] || 0);
  const shippedOrders = stats?.statusCounts?.["Shipped"] || 0;
  const deliveredOrders = stats?.statusCounts?.["Delivered"] || 0;

  const panels = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      subtitle: `${pendingOrders} pending`,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/dashboard/manager/fulfillment",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: `$${(stats?.todaySales || 0).toLocaleString()} today`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/dashboard/manager/stats",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      subtitle: `${stats?.totalSellers || 0} sellers`,
      icon: Users,
      color: "text-gray-700",
      bg: "bg-gray-100",
      href: "/dashboard/manager/sellers",
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
      subtitle: `${stats?.pendingSellerRequests || 0} seller requests`,
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/dashboard/manager/sellers",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {panels.map((panel, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={panel.href}
            className="block p-6 rounded-xl bg-white border border-gray-200 hover:border-gray-400 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${panel.bg}`}>
                <panel.icon className={panel.color} size={24} />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-400 group-hover:text-gray-900 transition-colors"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{panel.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {panel.value}
              </h3>
              <p className="text-xs text-gray-400">{panel.subtitle}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
