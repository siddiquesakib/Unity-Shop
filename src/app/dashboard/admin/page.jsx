"use client";

import { useState, useEffect } from "react";
import AdminAnalytics from "@/components/dashboard/admin/AdminAnalytics";
import VerificationQueue from "@/components/dashboard/admin/VerificationQueue";
import {
  Activity,
  ShieldCheck,
  Package,
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
        return "text-emerald-600";
      case "Shipped":
        return "text-blue-600";
      case "Processing":
        return "text-amber-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
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
    <div className="space-y-10 pb-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white border border-gray-100 shadow-sm">
              <ShieldCheck className="text-black" size={16} />
            </div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Root Administrator
            </span>
          </div>
          <h1 className="text-5xl font-black text-black uppercase tracking-tight leading-[0.9]">
            Nexus <span className="text-gray-200">Terminal</span>
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-md">
            Advanced platform metrics and real-time transaction monitoring interface.
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] self-start transition-all hover:border-black/20">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
          </div>
          <span className="text-xs font-black text-black uppercase tracking-widest">
            Systems Operational
          </span>
        </div>
      </div>

      {/* Main Analytics Section */}
      <AdminAnalytics />

      {/* Bottom Section - Management Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Verification Queue Component */}
        <VerificationQueue />

        {/* Recent Orders List */}
        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden relative group/card hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tight">
                Activity Stream
              </h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Internal Ledger Log</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-all duration-500">
              <Activity size={24} />
            </div>
          </div>

          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-black" size={40} strokeWidth={3} />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Retrieving Data</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-24 text-gray-300 text-sm font-bold border-2 border-dashed border-gray-50 rounded-[2.5rem] uppercase tracking-widest">
              No recent entries found
            </div>
          ) : (
            <div className="space-y-5">
              {recentOrders.slice(0, 6).map((order, i) => (
                <div
                  key={order._id || i}
                  className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white border border-gray-100 hover:border-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group/item"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-black group-hover/item:bg-black group-hover/item:text-white group-hover/item:border-black transition-all duration-500 shadow-sm">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black text-black leading-tight">
                        {order.productName || "Product Entry"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[120px]">
                          {order.customerName || order.customerEmail || "Anonymous"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span className="text-xs font-black text-black">
                          $
                          {Number(
                            order.amountPaid || order.amountpaid || 0,
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover/item:bg-emerald-500 group-hover/item:text-white group-hover/item:border-emerald-500' :
                      order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100 group-hover/item:bg-red-500 group-hover/item:text-white group-hover/item:border-red-500' :
                        'bg-gray-50 text-gray-600 border-gray-100 group-hover/item:bg-black group-hover/item:text-white group-hover/item:border-black'
                      }`}>
                      {order.status || "Pending"}
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                      {order.createdAt ? getTimeAgo(order.createdAt) : "Just Now"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
