"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  Clock,
  Filter,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

const getStatusIcon = (status) => {
  switch (status) {
    case "New":
      return <Clock size={14} />;
    case "Processing":
      return <Package size={14} />;
    case "Shipped":
      return <Truck size={14} />;
    case "Delivered":
      return <CheckCircle size={14} />;
    case "Cancelled":
      return <XCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders?sellerEmail=${encodeURIComponent(user.email)}`,
        );
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
    fetchOrders();
  }, [user?.email]);

  const updateOrderStatus = async (orderId, newStatus) => {
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

  const statuses = [
    "All",
    "New",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.productName || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.customerEmail || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.transitionId || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.amountPaid) || 0),
    0,
  );
  const newCount = orders.filter((o) => o.status === "New").length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400">
            Manage and track all orders for your products.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-slate-400">Total Orders: </span>
            <span className="text-white font-bold">{orders.length}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-slate-400">Revenue: </span>
            <span className="text-emerald-400 font-bold">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
          {newCount > 0 && (
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <span className="text-blue-400 font-bold">
                {newCount} new order{newCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search orders by product, customer, or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-slate-500" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-slate-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400 text-lg mb-2">
              {orders.length === 0
                ? "No orders yet"
                : "No orders match your filters"}
            </p>
            <p className="text-slate-500 text-sm">
              {orders.length === 0
                ? "When customers purchase your products, orders will appear here."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-800">
                  <th className="pb-4 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <span className="text-sm font-mono text-indigo-400">
                        #
                        {(order.transitionId || order._id)
                          .slice(-8)
                          .toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {order.customerName || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-slate-300 truncate max-w-[200px] block">
                        {order.productName || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-semibold text-emerald-400">
                      ${Number(order.amountPaid || 0).toFixed(2)}
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
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        {(order.status === "New" || !order.status) && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Processing")
                            }
                            title="Process Order"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {order.status === "Processing" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Shipped")
                            }
                            title="Mark Shipped"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors"
                          >
                            <Truck size={16} />
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Delivered")
                            }
                            title="Mark Delivered"
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {order.status !== "Cancelled" &&
                          order.status !== "Delivered" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order._id, "Cancelled")
                              }
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
                <span className="text-slate-400">Transaction ID</span>
                <span className="text-white font-mono text-xs">
                  {selectedOrder.transitionId || "N/A"}
                </span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between">
                <span className="text-slate-400">Customer</span>
                <span className="text-white">
                  {selectedOrder.customerName || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-white text-sm">
                  {selectedOrder.customerEmail}
                </span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between">
                <span className="text-slate-400">Product</span>
                <span className="text-white">
                  {selectedOrder.productName || "N/A"}
                </span>
              </div>
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
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
