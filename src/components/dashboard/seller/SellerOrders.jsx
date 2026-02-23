"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, Truck, XCircle, CheckCircle, Package, Clock } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders?sellerEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data.slice(0, 5)); // Show only 5 recent
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Processing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Shipped":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Recent Orders</h3>
        <Link
          href="/dashboard/seller/orders"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All Orders
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <Package size={36} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-400 text-sm">No orders yet</p>
          <p className="text-slate-500 text-xs mt-1">
            Orders will appear here when customers purchase your products.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-800">
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 text-sm font-mono text-indigo-400">
                    #{(order.transitionId || order._id).slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 text-sm text-slate-400">
                    {order.customerName || "Unknown"}
                  </td>
                  <td className="py-4 text-sm font-semibold text-white">
                    ${Number(order.amountPaid || 0).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status || "New",
                      )}`}
                    >
                      {order.status || "New"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(order.status === "New" || !order.status) && (
                        <button
                          onClick={() => updateStatus(order._id, "Processing")}
                          title="Process Order"
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {order.status === "Processing" && (
                        <button
                          onClick={() => updateStatus(order._id, "Shipped")}
                          title="Mark Shipped"
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          <Truck size={16} />
                        </button>
                      )}
                      {order.status !== "Cancelled" &&
                        order.status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order._id, "Cancelled")}
                            title="Cancel Order"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
