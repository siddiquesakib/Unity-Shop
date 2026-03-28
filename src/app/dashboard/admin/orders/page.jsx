"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import OrderTrackingModal from "@/components/common/OrderTrackingModal";
import {
  getOrderStatusLabel,
  normalizeToWorkflowStatus,
} from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";
const STATUS_STEPS = [
  "placed",
  "confirmed",
  "packed",
  "picked",
  "inTransit",
  "outForDelivery",
  "delivered",
  "cancelled",
];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const STATUS_COLOR = {
  placed: "bg-purple-50 text-purple-600 border-purple-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  packed: "bg-amber-50 text-amber-600 border-amber-200",
  picked: "bg-indigo-50 text-indigo-600 border-indigo-200",
  inTransit: "bg-cyan-50 text-cyan-600 border-cyan-200",
  outForDelivery: "bg-sky-50 text-sky-600 border-sky-200",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};
const STATUS_DOT = {
  placed: "bg-purple-500",
  confirmed: "bg-blue-500",
  packed: "bg-amber-500",
  picked: "bg-indigo-500",
  inTransit: "bg-cyan-500",
  outForDelivery: "bg-sky-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
};

function getIcon(status) {
  const s = normalizeToWorkflowStatus(status || "placed");
  if (s === "placed") return <Clock size={13} />;
  if (s === "confirmed" || s === "packed") return <Package size={13} />;
  if (s === "picked" || s === "inTransit" || s === "outForDelivery") {
    return <Truck size={13} />;
  }
  if (s === "delivered") return <CheckCircle size={13} />;
  if (s === "cancelled") return <XCircle size={13} />;
  return <Clock size={13} />;
}

function StatusDropdown({ order, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);
  const current = normalizeToWorkflowStatus(
    order.workflowStatus || order.status || "placed",
  );
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={updating}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${STATUS_COLOR[current] || "bg-gray-50 text-gray-600 border-gray-200"} ${updating ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
      >
        {updating ? (
          <RefreshCw size={11} className="animate-spin" />
        ) : (
          getIcon(current)
        )}
        {getOrderStatusLabel(current)}
        {!updating && (
          <ChevronDown
            size={11}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[150px]">
            {STATUS_STEPS.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setOpen(false);
                  if (status !== current) onStatusChange(order._id, status);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors ${status === current ? "bg-gray-50 text-gray-400 cursor-default" : "hover:bg-gray-50 text-gray-700"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || "bg-gray-400"}`}
                />
                {getOrderStatusLabel(status)}
                {status === current && (
                  <span className="ml-auto text-[10px] text-gray-400">
                    current
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Delivery Man Assignment States
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setOrders([]);
        return;
      }

      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];
        setOrders(
          rows.map((o) => ({
            ...o,
            workflowStatus: normalizeToWorkflowStatus(
              o.workflowStatus || o.status,
            ),
          })),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Delivery Men
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setDeliveryMen([]);
      fetchOrders();
      return;
    }

    fetch(`${API_BASE}/users/role/delivery`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDeliveryMen(data))
      .catch((err) => console.error("Failed to load delivery men", err));

    fetchOrders();
  }, []);

  const handleAssignDelivery = async (orderId) => {
    if (!selectedDeliveryMan) return;

    try {
      const token = getToken();
      if (!token) throw new Error("Missing auth token");

      const res = await fetch(`${API_BASE}/orders/assign/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryManId: selectedDeliveryMan }),
      });

      if (res.ok) {
        setAssigningId(null);
        setSelectedDeliveryMan("");
        fetchOrders(); // Refresh to show updated status
      }
    } catch (error) {
      console.error("Assignment failed", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Missing auth token");

      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          actorRole: "admin",
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Failed");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status: newStatus,
                workflowStatus: normalizeToWorkflowStatus(newStatus),
              }
            : o,
        ),
      );
      setUpdateSuccess(`Order updated to "${newStatus}"`);
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (err) {
      setUpdateError(err.message);
      setTimeout(() => setUpdateError(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = STATUS_STEPS.reduce((acc, s) => {
    acc[s] = orders.filter(
      (o) => normalizeToWorkflowStatus(o.workflowStatus || o.status) === s,
    ).length;
    return acc;
  }, {});

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    const m =
      (order.productName || "").toLowerCase().includes(q) ||
      (order.customerEmail || "").toLowerCase().includes(q) ||
      (order.customerName || "").toLowerCase().includes(q) ||
      (order.transitionId || "").toLowerCase().includes(q);
    return (
      m &&
      (statusFilter === "All" ||
        normalizeToWorkflowStatus(order.workflowStatus || order.status) ===
          statusFilter)
    );
  });
  // console.log("filteredorders:", orders);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-500">
            Update order statuses and track deliveries.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-black transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUS_STEPS.map((status, i) => (
          <motion.button
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "All" : status)
            }
            className={`bg-white border rounded-xl px-4 py-3 text-left transition-all ${statusFilter === status ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
          >
            <p className="text-xl font-black text-gray-900">
              {stats[status] || 0}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              {getIcon(status)}
              {status}
            </p>
          </motion.button>
        ))}
      </div>

      {updateSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl"
        >
          <CheckCircle size={15} />
          {updateSuccess}
        </motion.div>
      )}
      {updateError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl"
        >
          <AlertCircle size={15} />
          {updateError}
        </motion.div>
      )}

      {/* Assignment Modal */}
      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Assign Delivery</h3>
              <button
                onClick={() => setAssigningId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                Select a delivery partner for Order #{assigningId.slice(-6)}.
              </p>

              <div className="space-y-2 mb-6">
                {deliveryMen.length === 0 ? (
                  <p className="text-sm text-red-500">
                    No delivery personnel found. Create a user with 'delivery'
                    role first.
                  </p>
                ) : (
                  deliveryMen.map((man) => (
                    <label
                      key={man._id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200"
                    >
                      <input
                        type="radio"
                        name="deliveryMan"
                        value={man._id}
                        onChange={(e) => setSelectedDeliveryMan(e.target.value)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {man.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {man.phone || "No phone"}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <button
                onClick={() => handleAssignDelivery(assigningId)}
                disabled={!selectedDeliveryMan}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl p-5"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by product, customer, or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {["All", ...STATUS_STEPS].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === status ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900"}`}
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
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-1">No orders found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 bg-gray-50/50">
                  <th className="py-3 pl-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Update Status
                  </th>
                  <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assign Delivery
                  </th>
                  <th className="py-3 pr-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Track
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 pl-6">
                      <span className="text-sm font-mono text-gray-700">
                        #
                        {(order._id || order.transitionId)
                          .slice(-6)
                          .toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-700 truncate max-w-[160px] block">
                        {order.cartItems
                          ? `${order.cartItems.length} items`
                          : order.productName || "Order"}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-700 font-medium">
                        {order.userName || order.name || "—"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.email || "—"}
                      </p>
                    </td>
                    <td className="py-4 text-sm font-semibold text-emerald-600">
                      $
                      {Number(
                        order.totalAmount || order.amountPaid || 0,
                      ).toFixed(2)}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        : "N/A"}
                    </td>
                    <td className="py-4">
                      <StatusDropdown
                        order={order}
                        onStatusChange={handleStatusChange}
                        updating={updatingId === order._id}
                      />
                    </td>
                    <td className="py-4">
                      {order.deliveryManId ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => setAssigningId(order._id)}
                          disabled={
                            normalizeToWorkflowStatus(
                              order.workflowStatus || order.status,
                            ) === "cancelled" ||
                            normalizeToWorkflowStatus(
                              order.workflowStatus || order.status,
                            ) === "delivered"
                          }
                          className="text-xs font-medium text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => setTrackingOrderId(order._id)}
                        title="View tracking timeline"
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <MapPin size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {trackingOrderId && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}
