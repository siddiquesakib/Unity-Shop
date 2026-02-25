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
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Processing":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      case "New":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
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
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Recent Orders
          </h3>
          <Link
            href="/dashboard/user/orders"
            className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your orders will appear here after you make a purchase.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 text-sm font-mono text-gray-900">
                      #
                      {(order.transitionId || order._id)
                        .slice(-8)
                        .toUpperCase()}
                    </td>
                    <td className="py-4 text-sm text-gray-700 truncate max-w-[150px]">
                      {order.productName || "N/A"}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
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
                    <td className="py-4 text-sm font-semibold text-gray-900">
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
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
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
