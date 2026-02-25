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
      color: "bg-gray-800",
      icon: Package,
    },
    {
      label: "Shipped / In-Transit",
      count: shippedCount,
      percent: Math.round((shippedCount / totalOrders) * 100),
      color: "bg-gray-500",
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
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Manager Hub
          </h1>
          <p className="text-gray-500">
            Operations overview, fulfillment tracking, and platform statistics.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <span>Shift Status:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium border border-emerald-200">
            Active Management
          </span>
        </div>
      </div>

      {/* Manager Stats Cards */}
      <ManagerOverview />

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fulfillment Efficiency */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-400" />
              Order Fulfillment Status
            </h3>
            <Link
              href="/dashboard/manager/fulfillment"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Manage All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-100 rounded w-28" />
                    <div className="h-3 bg-gray-100 rounded w-10" />
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {fulfillmentBars.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <item.icon size={14} />
                      {item.label}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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
        <div className="p-6 rounded-xl bg-black flex flex-col justify-between overflow-hidden relative group">
          <TrendingUp
            size={120}
            className="absolute -bottom-4 -right-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">
              Platform Summary
            </h3>
            <p className="text-gray-400 text-sm">
              Daily performance overview for management.
            </p>
          </div>
          <div className="space-y-4 relative z-10 mt-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-sm text-gray-400">Today&apos;s Sales</span>
              <span className="text-lg font-bold text-white">
                ${loading ? "..." : (stats?.todaySales || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-sm text-gray-400">Today&apos;s Orders</span>
              <span className="text-lg font-bold text-white">
                {loading ? "..." : stats?.todayOrderCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-sm text-gray-400">New Users Today</span>
              <span className="text-lg font-bold text-white">
                +{loading ? "..." : stats?.newUsersToday || 0}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-sm text-gray-400">Seller Requests</span>
              <span className="text-lg font-bold text-white">
                {loading ? "..." : stats?.pendingSellerRequests || 0}
              </span>
            </div>
            <Link
              href="/dashboard/manager/stats"
              className="block w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors text-center"
            >
              View Full Stats
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package size={18} className="text-gray-400" />
            Recent Orders
          </h3>
          <Link
            href="/dashboard/manager/fulfillment"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : !stats?.recentOrders?.length ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order, i) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.customerName || order.CustomerName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                      {order.productName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">
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
                            ? "bg-emerald-50 text-emerald-600"
                            : (order.status || "New") === "Shipped"
                              ? "bg-blue-50 text-blue-600"
                              : (order.status || "New") === "Processing"
                                ? "bg-amber-50 text-amber-600"
                                : (order.status || "New") === "Cancelled"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status || "New"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
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
