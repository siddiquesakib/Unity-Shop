"use client";

import { useState, useEffect } from "react";
import AdminStats from "@/components/dashboard/admin/AdminStats";
import PlatformChart from "@/components/dashboard/admin/PlatformChart";
import VerificationQueue from "@/components/dashboard/admin/VerificationQueue";
import {
  Activity,
  ShieldCheck,
  Package,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/orders/platform-stats`)
      .then((res) => res.json())
      .then((data) => {
        setRecentOrders(data.recentOrders || []);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recent orders:", err);
        setLoadingOrders(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-400";
      case "Shipped":
        return "text-blue-400";
      case "Processing":
        return "text-yellow-400";
      case "Cancelled":
        return "text-rose-400";
      default:
        return "text-indigo-400";
    }
  };

  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              System Administrator
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-slate-400">
            Platform-wide overview, user management, and system health.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-300">
            System Status: Optimal
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <AdminStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformChart />
        <VerificationQueue />
      </div>

      {/* Bottom Section - Recent Orders */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" />
            Recent Orders
          </h3>
          <span className="text-xs text-slate-500">Last 10 transactions</span>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-indigo-400" size={24} />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No recent orders found
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order, i) => (
              <div
                key={order._id || i}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Package size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {order.productName || "Unknown Product"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customerName || order.customerEmail || "Unknown"} ·
                      $
                      {Number(
                        order.amountPaid || order.amountpaid || 0,
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status || "New"}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {order.createdAt ? getTimeAgo(order.createdAt) : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
