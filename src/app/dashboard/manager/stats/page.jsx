"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock,
  Truck,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function PlatformStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setStats(null);
        return;
      }

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
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const workflowStatusCounts = stats?.statusCounts || {};
  const placedCount = workflowStatusCounts.placed || 0;
  const processingCount =
    (workflowStatusCounts.confirmed || 0) +
    (workflowStatusCounts.packed || 0);
  const shippedCount =
    (workflowStatusCounts.picked || 0) +
    (workflowStatusCounts.inTransit || 0) +
    (workflowStatusCounts.outForDelivery || 0);
  const deliveredCount = workflowStatusCounts.delivered || 0;
  const cancelledCount = workflowStatusCounts.cancelled || 0;

  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          subtitle: `$${stats.todaySales.toLocaleString()} today`,
          icon: DollarSign,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        },
        {
          title: "Total Orders",
          value: stats.totalOrders,
          subtitle: `${stats.todayOrderCount} today`,
          icon: Package,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
        },
        {
          title: "Total Users",
          value: stats.totalUsers,
          subtitle: `+${stats.newUsersToday} today`,
          icon: Users,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        },
        {
          title: "Active Sellers",
          value: stats.totalSellers,
          subtitle: `${stats.pendingSellerRequests} pending requests`,
          icon: UserCheck,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
        },
        {
          title: "Total Products",
          value: stats.totalProducts,
          subtitle: "Listed on platform",
          icon: ShoppingBag,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        },
        {
          title: "Avg. Order Value",
          value:
            stats.totalOrders > 0
              ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}`
              : "$0",
          subtitle: "Per order",
          icon: TrendingUp,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
        },
      ]
    : [];

  // Max revenue for chart scaling
  const maxRevenue = stats
    ? Math.max(...stats.last7Days.map((d) => d.revenue), 1)
    : 1;
  const maxOrders = stats
    ? Math.max(...stats.last7Days.map((d) => d.orders), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="text-indigo-400" size={20} />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Platform Statistics
          </h1>
          <p className="text-slate-400">
            Complete overview of platform performance and metrics.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw
            size={18}
            className={`text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 mb-4" />
              <div className="h-3 bg-slate-800 rounded w-20 mb-3" />
              <div className="h-8 bg-slate-800 rounded w-24 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl bg-slate-900 border ${card.border}`}
            >
              <div className={`p-3 rounded-xl ${card.bg} w-fit mb-4`}>
                <card.icon className={card.color} size={24} />
              </div>
              <p className="text-sm text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mb-1">
                {card.value}
              </h3>
              <p className="text-xs text-slate-500">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart - Last 7 Days */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-400" />
              Revenue (Last 7 Days)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Daily revenue overview
            </p>
            <div className="flex items-end gap-3 h-48">
              {stats.last7Days.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(day.revenue / maxRevenue) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <span className="text-xs text-emerald-400 font-medium mb-1">
                    {day.revenue > 0 ? `$${day.revenue}` : ""}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg min-h-[4px]"
                    style={{
                      height: `${Math.max((day.revenue / maxRevenue) * 100, 3)}%`,
                    }}
                  />
                  <span className="text-xs text-slate-500 mt-2">{day.day}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Orders Chart - Last 7 Days */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Package size={18} className="text-indigo-400" />
              Orders (Last 7 Days)
            </h3>
            <p className="text-xs text-slate-500 mb-6">Daily order count</p>
            <div className="flex items-end gap-3 h-48">
              {stats.last7Days.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(day.orders / maxOrders) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <span className="text-xs text-indigo-400 font-medium mb-1">
                    {day.orders > 0 ? day.orders : ""}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg min-h-[4px]"
                    style={{
                      height: `${Math.max((day.orders / maxOrders) * 100, 3)}%`,
                    }}
                  />
                  <span className="text-xs text-slate-500 mt-2">{day.day}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Status Breakdown */}
      {!loading && stats && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-400" />
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              {
                label: "New",
                count: placedCount,
                icon: Clock,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                label: "Processing",
                count: processingCount,
                icon: Package,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                label: "Shipped",
                count: shippedCount,
                icon: Truck,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                label: "Delivered",
                count: deliveredCount,
                icon: CheckCircle,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Cancelled",
                count: cancelledCount,
                icon: Package,
                color: "text-rose-400",
                bg: "bg-rose-500/10",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center"
              >
                <div className={`p-2 rounded-lg ${item.bg} w-fit mx-auto mb-2`}>
                  <item.icon className={item.color} size={20} />
                </div>
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
