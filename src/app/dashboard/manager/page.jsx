"use client";

import { useState, useEffect } from "react";
import ManagerOverview from "@/components/dashboard/manager/ManagerOverview";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ManagerDashboard() {
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

  // Calculate fulfillment percentages
  const totalOrders = stats?.totalOrders || 1;
  const newCount = stats?.statusCounts?.["New"] || 0;
  const processingCount = stats?.statusCounts?.["Processing"] || 0;
  const shippedCount = stats?.statusCounts?.["Shipped"] || 0;
  const deliveredCount = stats?.statusCounts?.["Delivered"] || 0;

  const fulfillmentBars = [
    {
      label: "New / Pending",
      count: newCount,
      percent: Math.round((newCount / totalOrders) * 100),
      color: "bg-amber-500",
      icon: Clock,
    },
    {
      label: "Processing",
      count: processingCount,
      percent: Math.round((processingCount / totalOrders) * 100),
      color: "bg-indigo-500",
      icon: Package,
    },
    {
      label: "Shipped / In-Transit",
      count: shippedCount,
      percent: Math.round((shippedCount / totalOrders) * 100),
      color: "bg-purple-500",
      icon: Truck,
    },
    {
      label: "Delivered",
      count: deliveredCount,
      percent: Math.round((deliveredCount / totalOrders) * 100),
      color: "bg-emerald-500",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Manager Hub
          </h1>
          <p className="text-slate-400">
            Operations overview, fulfillment tracking, and platform statistics.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
          <span>Shift Status:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            Active Management
          </span>
        </div>
      </div>

      {/* Manager Stats Cards */}
      <ManagerOverview />

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fulfillment Efficiency */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart size={18} className="text-indigo-400" />
              Order Fulfillment Status
            </h3>
            <Link
              href="/dashboard/manager/fulfillment"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Manage All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-800 rounded w-28" />
                    <div className="h-3 bg-slate-800 rounded w-10" />
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {fulfillmentBars.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <item.icon size={14} />
                      {item.label}
                    </span>
                    <span className="text-white font-medium">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.15 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Summary */}
        <div className="p-6 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/10 flex flex-col justify-between overflow-hidden relative group">
          <TrendingUp
            size={120}
            className="absolute -bottom-4 -right-4 text-indigo-500/50 rotate-12 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">
              Platform Summary
            </h3>
            <p className="text-indigo-100/70 text-sm">
              Daily performance overview for management.
            </p>
          </div>
          <div className="space-y-4 relative z-10 mt-6">
            <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
              <span className="text-sm text-indigo-100">
                Today&apos;s Sales
              </span>
              <span className="text-lg font-bold text-white">
                ${loading ? "..." : (stats?.todaySales || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
              <span className="text-sm text-indigo-100">
                Today&apos;s Orders
              </span>
              <span className="text-lg font-bold text-white">
                {loading ? "..." : stats?.todayOrderCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
              <span className="text-sm text-indigo-100">New Users Today</span>
              <span className="text-lg font-bold text-white">
                +{loading ? "..." : stats?.newUsersToday || 0}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
              <span className="text-sm text-indigo-100">Seller Requests</span>
              <span className="text-lg font-bold text-white">
                {loading ? "..." : stats?.pendingSellerRequests || 0}
              </span>
            </div>
            <Link
              href="/dashboard/manager/stats"
              className="block w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors text-center"
            >
              View Full Stats
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package size={18} className="text-indigo-400" />
            Recent Orders
          </h3>
          <Link
            href="/dashboard/manager/fulfillment"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : !stats?.recentOrders?.length ? (
          <div className="text-center py-12 text-slate-500">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.recentOrders.map((order, i) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {order.customerName || order.CustomerName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400 max-w-[200px] truncate">
                      {order.productName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-medium">
                      $
                      {(
                        Number(order.amountPaid) ||
                        Number(order.amountpaid) ||
                        0
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          (order.status || "New") === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : (order.status || "New") === "Shipped"
                              ? "bg-purple-500/10 text-purple-400"
                              : (order.status || "New") === "Processing"
                                ? "bg-blue-500/10 text-blue-400"
                                : (order.status || "New") === "Cancelled"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {order.status || "New"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
