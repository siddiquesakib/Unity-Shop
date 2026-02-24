"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function RecentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders?customerEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data.slice(0, 5));
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
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Processing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "New":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Clock size={12} />;
      case "Processing":
        return <Package size={12} />;
      case "Shipped":
        return <Truck size={12} />;
      case "Delivered":
        return <CheckCircle size={12} />;
      case "Cancelled":
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
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <Link
            href="/dashboard/user/orders"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-slate-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-400">No orders yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Your orders will appear here after you make a purchase.
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
                    Product
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
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
                      #
                      {(order.transitionId || order._id)
                        .slice(-8)
                        .toUpperCase()}
                    </td>
                    <td className="py-4 text-sm text-slate-300 truncate max-w-[150px]">
                      {order.productName || "N/A"}
                    </td>
                    <td className="py-4 text-sm text-slate-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                    <td className="py-4 text-sm font-semibold text-white">
                      ${Number(order.amountPaid || 0).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status || "New",
                        )}`}
                      >
                        {getStatusIcon(order.status || "New")}
                        {order.status || "New"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-lg w-[90%] shadow-2xl"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <XCircle size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID</span>
                <span className="text-white font-mono text-sm">
                  #
                  {(selectedOrder.transitionId || selectedOrder._id)
                    .slice(-8)
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Product</span>
                <span className="text-white">
                  {selectedOrder.productName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller</span>
                <span className="text-white">
                  {selectedOrder.sellerName || "N/A"}
                </span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="text-emerald-400 font-bold">
                  ${Number(selectedOrder.amountPaid || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span className="text-white">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    selectedOrder.status || "New",
                  )}`}
                >
                  {getStatusIcon(selectedOrder.status || "New")}
                  {selectedOrder.status || "New"}
                </span>
              </div>
              {selectedOrder.transitionId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">
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
