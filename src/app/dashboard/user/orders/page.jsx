"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/contexts/SocketContext";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  MapPin,
  Trash2,
} from "lucide-react";
import { downloadOrderInvoice } from "@/utils/generateInvoice";
import OrderTrackingModal from "@/components/common/OrderTrackingModal";
import {
  getOrderStatusLabel,
  normalizeToWorkflowStatus,
} from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function resolveOrderId(order) {
  if (!order) return "";
  if (typeof order._id === "string") return order._id;
  if (order?._id?.$oid) return String(order._id.$oid);
  return "";
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const getStatusColor = (status) => {
  const workflow = normalizeToWorkflowStatus(status);
  switch (workflow) {
    case "placed":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "confirmed":
    case "packed":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "picked":
    case "inTransit":
    case "outForDelivery":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "delivered":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  const workflow = normalizeToWorkflowStatus(status);
  switch (workflow) {
    case "placed":
      return <Clock size={14} />;
    case "confirmed":
    case "packed":
      return <Package size={14} />;
    case "picked":
    case "inTransit":
    case "outForDelivery":
      return <Truck size={14} />;
    case "delivered":
      return <CheckCircle size={14} />;
    case "cancelled":
      return <XCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

const isTrackable = (status) =>
  normalizeToWorkflowStatus(status) !== "cancelled";
const canUserCancel = (status) =>
  ["placed", "confirmed"].includes(normalizeToWorkflowStatus(status));

export default function UserOrdersPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const fetchOrders = useCallback(async () => {
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
        const rows = Array.isArray(data) ? data : [];
        setOrders(
          rows.map((order) => ({
            ...order,
            // এখানে স্ট্যাটাস নরমালাইজেশন আরও নিখুঁত করা হয়েছে
            workflowStatus: normalizeToWorkflowStatus(
              order.workflowStatus || order.status,
            ),
          })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;
    const handleTrackingUpdated = () => fetchOrders();
    socket.on("orderTrackingUpdated", handleTrackingUpdated);
    return () => socket.off("orderTrackingUpdated", handleTrackingUpdated);
  }, [socket, fetchOrders]);

  const statuses = [
    "All",
    "placed",
    "confirmed",
    "packed",
    "picked",
    "inTransit",
    "outForDelivery",
    "delivered",
    "cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();
    // এখানে productName এর বদলে orderCode এবং customerEmail যোগ করা হয়েছে
    const matchesSearch =
      (order.orderCode || "").toLowerCase().includes(searchLower) ||
      (order.customerEmail || "").toLowerCase().includes(searchLower) ||
      (order.transitionId || "").toLowerCase().includes(searchLower);

    const currentStatus = normalizeToWorkflowStatus(
      order.workflowStatus || order.status,
    );
    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.amountPaid) || 0),
    0,
  );

  const handleCancelOrder = async (order) => {
    const targetId = resolveOrderId(order);
    if (!targetId || cancellingId) return;

    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      const token = getToken();
      setCancellingId(targetId);

      const res = await fetch(`${API_BASE}/orders/track/${targetId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || "Failed to cancel order");

      setOrders((prev) =>
        prev.map((item) =>
          resolveOrderId(item) === targetId
            ? {
                ...item,
                status: "cancelled",
                workflowStatus: "cancelled",
              }
            : item,
        ),
      );
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancellingId("");
    }
  };
  console.log("allorders for this useresa", orders);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">Track and manage all your purchases.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
            <span className="text-gray-500">Total Orders: </span>
            <span className="text-gray-900 font-bold">{orders.length}</span>
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
            <span className="text-gray-500">Total Spent: </span>
            <span className="text-emerald-600 font-bold">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by Order Code, Email, or Transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
              >
                {status === "All" ? "All" : getOrderStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-2xl p-6"
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No orders match your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-4 pl-4 text-xs font-semibold text-gray-500 uppercase">
                    Order Code
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase text-right pr-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={resolveOrderId(order) || order.transitionId}
                    className="group hover:bg-gray-50"
                  >
                    <td className="py-4 pl-4">
                      <span className="text-sm font-mono text-gray-900">
                        #
                        {order.orderCode ||
                          (order.transitionId || "").slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-semibold text-emerald-600">
                      ${Number(order.amountPaid || 0).toFixed(2)}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.workflowStatus || order.status)}`}
                      >
                        {getStatusIcon(order.workflowStatus || order.status)}
                        {getOrderStatusLabel(
                          order.workflowStatus || order.status,
                        )}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isTrackable(order.workflowStatus || order.status) && (
                          <button
                            onClick={() =>
                              setTrackingOrderId(resolveOrderId(order))
                            }
                            className="p-2 text-gray-400 hover:text-blue-600"
                          >
                            <MapPin size={16} />
                          </button>
                        )}
                        {canUserCancel(
                          order.workflowStatus || order.status,
                        ) && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-gray-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => downloadOrderInvoice(order)}
                          className="p-2 text-gray-400 hover:text-gray-900"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl p-8 max-w-lg w-[90%] shadow-2xl"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <XCircle size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Order Code</span>
                <span className="font-mono">{selectedOrder.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="text-emerald-600 font-bold">
                  ${Number(selectedOrder.amountPaid).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.workflowStatus || selectedOrder.status)}`}
                >
                  {getOrderStatusLabel(
                    selectedOrder.workflowStatus || selectedOrder.status,
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {trackingOrderId && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}
