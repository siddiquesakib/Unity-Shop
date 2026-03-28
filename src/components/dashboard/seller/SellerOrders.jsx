"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, Truck, XCircle, CheckCircle, Package, Clock } from "lucide-react";
import Link from "next/link";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(
          `${API_BASE}/orders?sellerEmail=${encodeURIComponent(user.email)}`,
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, actorRole: "seller" }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o._id === orderId
              ? { ...o, status: newStatus, workflowStatus: normalizeToWorkflowStatus(newStatus) }
              : o,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const getStatusColor = (status) => {
    const workflow = normalizeToWorkflowStatus(status);
    switch (workflow) {
      case "placed":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "confirmed":
      case "packed":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "picked":
      case "inTransit":
      case "outForDelivery":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-500 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <Link
          href="/dashboard/seller/orders"
          className="text-sm text-gray-500 hover:text-gray-600 transition-colors"
        >
          View All Orders
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <Package size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No orders yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Orders will appear here when customers purchase your products.
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
                  Customer
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
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-gray-100/30 transition-colors"
                >
                  <td className="py-4 text-sm font-mono text-gray-500">
                    #{(order.transitionId || order._id).slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {order.customerName || "Unknown"}
                  </td>
                  <td className="py-4 text-sm font-semibold text-gray-900">
                    ${Number(order.amountPaid || 0).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.workflowStatus || order.status,
                      )}`}
                    >
                      {getOrderStatusLabel(order.workflowStatus || order.status || "placed")}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {order.workflowStatus === "confirmed" && (
                        <button
                          onClick={() => updateStatus(order._id, "packed")}
                          title="Mark Packed"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {order.workflowStatus !== "cancelled" &&
                        order.workflowStatus !== "delivered" && (
                          <button
                            onClick={() => updateStatus(order._id, "cancelled")}
                            title="Cancel Order"
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
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
