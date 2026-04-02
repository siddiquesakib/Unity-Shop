"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unityshop-server.onrender.com";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function RecentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(
          `${API_BASE}/orders?customerEmail=${encodeURIComponent(user.email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          const rows = (Array.isArray(data) ? data : []).map((o) => ({
            ...o,
            workflowStatus: normalizeToWorkflowStatus(o.workflowStatus || o.status),
          }));
          setOrders(rows.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const getStatusColor = (status) => {
    const workflow = normalizeToWorkflowStatus(status);
    switch (workflow) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "confirmed":
      case "packed":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "picked":
      case "inTransit":
      case "outForDelivery":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      case "placed":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const workflow = normalizeToWorkflowStatus(status);
    switch (workflow) {
      case "placed":
        return <Clock size={12} />;
      case "confirmed":
      case "packed":
        return <Package size={12} />;
      case "picked":
      case "inTransit":
      case "outForDelivery":
        return <Truck size={12} />;
      case "delivered":
        return <CheckCircle size={12} />;
      case "cancelled":
        return <XCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-10 rounded-[2.5rem] bg-white border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] group/activity"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tight uppercase">
              Recent <span className="text-gray-300">Activity</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Your latest transactions</p>
          </div>
          <Link
            href="/dashboard/user/orders"
            className="text-[10px] font-black text-gray-300 hover:text-black transition-colors uppercase tracking-[0.2em]"
          >
            History Hub →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-50 rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <Package size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No Recorded Activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-gray-50 hover:border-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group/item cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover/item:bg-black group-hover/item:text-white transition-all duration-500 shadow-sm">
                    <Package size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-black leading-tight group-hover/item:translate-x-1 transition-transform duration-300">
                      {order.productName || "Product Purchase"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        ${Number(order.amountPaid || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${getStatusColor(order.workflowStatus || order.status)
                    } group-hover/item:border-black transition-colors`}>
                    {getOrderStatusLabel(order.workflowStatus || order.status || "placed")}
                  </span>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.1em]">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : "--"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>


      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-[90%] shadow-2xl"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <XCircle size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Order Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="text-gray-900 font-mono text-sm">
                  #
                  {(selectedOrder.transitionId || selectedOrder._id)
                    .slice(-8)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>
                <span className="text-gray-900">
                  {selectedOrder.productName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seller</span>
                <span className="text-gray-900">
                  {selectedOrder.sellerName || "N/A"}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="text-emerald-600 font-bold">
                  ${Number(selectedOrder.amountPaid || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                    selectedOrder.workflowStatus || selectedOrder.status || "placed",
                  )}`}
                >
                  {getStatusIcon(selectedOrder.workflowStatus || selectedOrder.status || "placed")}
                  {getOrderStatusLabel(selectedOrder.workflowStatus || selectedOrder.status || "placed")}
                </span>
              </div>
              {selectedOrder.transitionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {selectedOrder.transitionId}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
