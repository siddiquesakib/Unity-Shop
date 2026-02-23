"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Eye,
  X,
  Filter,
} from "lucide-react";

const statusOptions = [
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusConfig = {
  New: { color: "bg-amber-500/10 text-amber-400", icon: Clock },
  Processing: { color: "bg-blue-500/10 text-blue-400", icon: Package },
  Shipped: { color: "bg-purple-500/10 text-purple-400", icon: Truck },
  Delivered: { color: "bg-emerald-500/10 text-emerald-400", icon: CheckCircle },
  Cancelled: { color: "bg-rose-500/10 text-rose-400", icon: XCircle },
};

export default function FulfillmentPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter & search
  const filteredOrders = orders.filter((order) => {
    const status = order.status || "New";
    if (filter !== "all" && status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (order.customerName || order.CustomerName || "")
          .toLowerCase()
          .includes(q) ||
        (order.customerEmail || "").toLowerCase().includes(q) ||
        (order.productName || "").toLowerCase().includes(q) ||
        (order._id || "").toLowerCase().includes(q) ||
        (order.sellerName || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Status counts
  const statusCounts = { all: orders.length };
  orders.forEach((o) => {
    const s = o.status || "New";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const filterTabs = [
    { key: "all", label: "All", icon: Package },
    { key: "New", label: "New", icon: Clock },
    { key: "Processing", label: "Processing", icon: Package },
    { key: "Shipped", label: "Shipped", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle },
    { key: "Cancelled", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="text-indigo-400" size={20} />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Order Fulfillment
          </h1>
          <p className="text-slate-400">
            Manage and track all platform orders across all sellers.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw
            size={18}
            className={`text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search by customer, product, seller, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            <span className="text-xs opacity-60">
              ({statusCounts[tab.key] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Package size={48} className="mb-3 opacity-30" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">
              {searchQuery
                ? "Try a different search term."
                : `No ${filter === "all" ? "" : filter + " "}orders on the platform.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence>
                  {filteredOrders.map((order, i) => {
                    const status = order.status || "New";
                    const config = statusConfig[status] || statusConfig["New"];
                    const StatusIcon = config.icon;
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                          #{order._id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-white">
                            {order.customerName || order.CustomerName || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.customerEmail || ""}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400 max-w-[180px] truncate">
                          {order.productName || "N/A"}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-400">
                            {order.sellerName || "N/A"}
                          </p>
                          <p className="text-xs text-slate-600">
                            {order.sellerEmail || ""}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-emerald-400 font-medium">
                          $
                          {(
                            Number(order.amountPaid) ||
                            Number(order.amountpaid) ||
                            0
                          ).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                          >
                            <StatusIcon size={12} />
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">
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
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <select
                              value={status}
                              onChange={(e) =>
                                handleStatusUpdate(order._id, e.target.value)
                              }
                              disabled={updatingId === order._id}
                              className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-white mb-4">
                Order #{selectedOrder._id?.slice(-6).toUpperCase()}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer</span>
                  <span className="text-white">
                    {selectedOrder.customerName ||
                      selectedOrder.CustomerName ||
                      "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white">
                    {selectedOrder.customerEmail || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Product</span>
                  <span className="text-white">
                    {selectedOrder.productName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Seller</span>
                  <span className="text-white">
                    {selectedOrder.sellerName || "N/A"} (
                    {selectedOrder.sellerEmail || ""})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-emerald-400 font-medium">
                    $
                    {(
                      Number(selectedOrder.amountPaid) ||
                      Number(selectedOrder.amountpaid) ||
                      0
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white">
                    {selectedOrder.quantity || 1}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">
                    {selectedOrder.transitionId ||
                      selectedOrder.TransitionId ||
                      "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Status</span>
                  <select
                    value={selectedOrder.status || "New"}
                    onChange={(e) =>
                      handleStatusUpdate(selectedOrder._id, e.target.value)
                    }
                    disabled={updatingId === selectedOrder._id}
                    className="text-sm bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
