"use client";

import { useState, useEffect, useCallback } from "react";
import ManagerOverview from "@/components/dashboard/manager/ManagerOverview";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  Truck,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Calculate fulfillment percentages
  const totalOrders = stats?.totalOrders || 1;
  const newCount = stats?.statusCounts?.["placed"] || 0;
  const processingCount = stats?.statusCounts?.["confirmed"] || 0;
  const shippedCount =
    (stats?.statusCounts?.["picked"] || 0) +
    (stats?.statusCounts?.["inTransit"] || 0) +
    (stats?.statusCounts?.["outForDelivery"] || 0);
  const deliveredCount = stats?.statusCounts?.["delivered"] || 0;

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
    <div className="space-y-12 pb-16 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-black shadow-lg shadow-black/10">
              <Package className="text-white" size={16} />
            </div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Operations Command
            </span>
          </div>
          <h1 className="text-5xl font-black text-black uppercase tracking-tight leading-[0.9]">
            Manager <span className="text-gray-200">Hub</span>
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-md">
            Operational overview, fulfillment tracking, and mission-critical platform metrics.
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] self-start transition-all hover:border-black/20 group cursor-default">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
          </div>
          <span className="text-xs font-black text-black uppercase tracking-widest">
            Management Active
          </span>
        </div>
      </div>

      {/* Manager Stats Cards */}
      <ManagerOverview />

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Fulfillment Efficiency */}
        <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] group/card">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tight uppercase">
                Fulfillment <span className="text-gray-300">Velocity</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Logistics Pipeline Status</p>
            </div>
            <Link
              href="/dashboard/manager/fulfillment"
              className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-all duration-500 shadow-sm"
            >
              <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-8 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-50 rounded-lg w-32" />
                    <div className="h-4 bg-gray-50 rounded-lg w-12" />
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {fulfillmentBars.map((item, i) => (
                <div key={i} className="space-y-3 group/bar">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                    <span className="text-gray-400 flex items-center gap-3 group-hover/bar:text-black transition-colors">
                      <item.icon size={16} strokeWidth={2.5} />
                      {item.label}
                    </span>
                    <span className="text-black bg-gray-50 px-3 py-1 rounded-lg">
                      {item.count} <span className="text-gray-300 ml-1">[{item.percent}%]</span>
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1.5, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                      className={`h-full rounded-full ${i % 2 === 0 ? 'bg-black' : 'bg-gray-400'} shadow-lg shadow-black/5`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Summary */}
        <div className="p-10 rounded-[2.5rem] bg-black text-white flex flex-col justify-between overflow-hidden relative group/summary shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
          <TrendingUp
            size={180}
            className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover/summary:scale-110 group-hover/summary:text-white/10 transition-all duration-700"
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 tracking-tight uppercase">
              Operational <span className="text-gray-500">Pulse</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-10">Real-time Summary Matrix</p>

            <div className="space-y-6">
              {[
                { label: "Daily Revenue", value: `$${(stats?.todaySales || 0).toLocaleString()}`, highlight: true },
                { label: "Daily Volume", value: `${stats?.todayOrderCount || 0} Units` },
                { label: "New Entrants", value: `+${stats?.newUsersToday || 0} Total` },
                { label: "Onboarding Queue", value: `${stats?.pendingSellerRequests || 0} Pending` },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4 group/row">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/row:text-gray-200 transition-colors">{row.label}</span>
                  <span className={`text-xl font-black tracking-tighter ${row.highlight ? 'text-white' : 'text-gray-400 group-hover/row:text-white transition-colors'}`}>
                    {loading ? "---" : row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/manager/stats"
            className="relative z-10 block w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 text-center shadow-2xl mt-10 hover:-translate-y-1"
          >
            Access Core Analytics
          </Link>
        </div>
      </div>

      {/* Recent Orders Styled as Activity Stream */}
      <div className="p-10 rounded-[2.5rem] bg-white border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] group/activity">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tight uppercase">
              Activity <span className="text-gray-300">Stream</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Platform Transaction Ledger</p>
          </div>
          <Link
            href="/dashboard/manager/fulfillment"
            className="text-[10px] font-black text-gray-300 hover:text-black transition-colors uppercase tracking-[0.2em]"
          >
            Monitor All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : !stats?.recentOrders?.length ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <Package size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No Recorded Activity</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.recentOrders.slice(0, 6).map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white border border-gray-50 hover:border-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group/item"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover/item:bg-black group-hover/item:text-white transition-all duration-500 shadow-sm">
                    <ShoppingCart size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-black leading-tight group-hover/item:translate-x-1 transition-transform duration-300">
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                      {order.productName || "Unknown Product"}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-gray-50 text-gray-600 border-gray-100 group-hover/item:border-black'
                    }`}>
                    {order.status || "Pending"}
                  </span>
                  <p className="text-[9px] font-black text-gray-300 uppercase">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "--"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
}
