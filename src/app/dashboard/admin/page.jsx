"use client";

import { useState, useEffect, useCallback } from "react";
import AdminAnalytics from "@/components/dashboard/admin/AdminAnalytics";
import VerificationQueue from "@/components/dashboard/admin/VerificationQueue";
import {
  Activity,
  ShieldCheck,
  Package,
  Loader2,
} from "lucide-react";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchRecentOrders = useCallback(() => {
    const token = getToken();
    if (!token) {
      setLoadingOrders(false);
      return;
    }

    fetch(`${API_BASE}/orders/platform-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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

  useEffect(() => {
    fetchRecentOrders();
  }, [fetchRecentOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-emerald-600";
      case "picked":
      case "inTransit":
      case "outForDelivery":
        return "text-blue-600";
      case "confirmed":
      case "packed":
        return "text-amber-600";
      case "cancelled":
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
    <div className="space-y-6 pb-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-gray-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white border-2 border-gray-100 shadow-sm">
              <ShieldCheck className="text-black" size={14} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Root Administrator
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight leading-none">
            Nexus <span className="text-gray-300">Terminal</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-bold max-w-md">
            Advanced platform metrics and real-time transaction monitoring interface.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white border-2 border-gray-100 flex items-center gap-3 shadow-sm self-start transition-all hover:border-black">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
          </div>
          <span className="text-[10px] font-black text-black uppercase tracking-widest">
            Systems Operational
          </span>
        </div>
      </div>

      {/* Main Analytics Section */}
      <AdminAnalytics />

      {/* Bottom Section - Management Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Verification Queue Component */}
        <VerificationQueue />

        {/* Recent Orders List */}
        <div className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm overflow-hidden relative group/card hover:border-black transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-black flex items-center gap-2 tracking-tight uppercase">
                Activity Stream
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Internal Ledger Log</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 border-2 border-gray-100 text-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white group-hover/card:border-black transition-all duration-300">
              <Activity size={18} strokeWidth={2.5} />
            </div>
          </div>

          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="animate-spin text-black" size={32} strokeWidth={2.5} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Data</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs font-black border-2 border-dashed border-gray-100 rounded-xl uppercase tracking-widest">
              No recent entries found
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.slice(0, 6).map((order, i) => (
                <div
                  key={order._id || i}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border-2 border-transparent hover:bg-white hover:border-black transition-all duration-300 group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border-2 border-gray-100 flex items-center justify-center text-black group-hover/item:bg-black group-hover/item:text-white group-hover/item:border-black transition-all duration-300 shadow-sm">
                      <Package size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-black leading-tight">
                        {order.productName || "Product Entry"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate max-w-[120px]">
                          {order.customerName || order.customerEmail || "Anonymous"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[10px] font-black text-black">
                          $
                          {Number(
                            order.amountPaid || order.amountpaid || 0,
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <div className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border-2 transition-colors ${normalizeToWorkflowStatus(order.workflowStatus || order.status) === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover/item:bg-emerald-500 group-hover/item:text-white group-hover/item:border-emerald-500' :
                      normalizeToWorkflowStatus(order.workflowStatus || order.status) === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100 group-hover/item:bg-red-500 group-hover/item:text-white group-hover/item:border-red-500' :
                        'bg-white text-gray-600 border-gray-200 group-hover/item:bg-black group-hover/item:text-white group-hover/item:border-black'
                      }`}>
                      {getOrderStatusLabel(order.workflowStatus || order.status || "placed")}
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
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
