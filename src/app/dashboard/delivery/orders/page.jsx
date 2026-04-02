"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Truck, MapPin, CheckCircle, Clock, Route, Search, Package, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";
import { useCurrency } from "@/contexts/CurrencyContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const DELIVERY_FLOW = ["picked", "inTransit", "outForDelivery", "delivered"];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function DeliveryOrders() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    if (!user?._id) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/orders/my-deliveries/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data?.orders || [];
      
      const formatted = rows.map((o) => ({
        ...o,
        workflowStatus: normalizeToWorkflowStatus(o.workflowStatus || o.status),
      }));
      
      // Sort by recent assignedAt or createdAt
      formatted.sort((a, b) => new Date(b.assignedAt || b.createdAt) - new Date(a.assignedAt || a.createdAt));
      
      setOrders(formatted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?._id]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = getToken();
      if (!token) throw new Error("Missing auth token");

      const res = await fetch(`${API_BASE}/orders/track/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update status");
      }

      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      (order.orderCode || "").toLowerCase().includes(q) ||
      (order.productName || "").toLowerCase().includes(q) ||
      (order.customerName || "").toLowerCase().includes(q) ||
      (order.customerEmail || "").toLowerCase().includes(q) ||
      (order.shippingAddress?.address || "").toLowerCase().includes(q) ||
      (order.shippingAddress?.city || "").toLowerCase().includes(q)
    );
  });
console.log('orderds' ,orders, 'fiter' ,filteredOrders )
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Truck className="text-blue-600" /> My Assigned Deliveries
        </h1>
        <p className="text-gray-500">Manage and update your assigned deliveries.</p>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, area, customer, or order code..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                    {order.productName || "Product Name N/A"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>
                      Code: <span className="font-mono text-gray-700 font-medium">{order.orderCode || `#${String(order._id).slice(-6)}`}</span>
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span>
                      Assigned: {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(Number(order.amountPaid || 0).toFixed(2))}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {order.quantity || 1}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    order.workflowStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getOrderStatusLabel(order.workflowStatus || order.status)}
                  </span>
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                      <User size={12} /> Customer Information
                    </h3>
                    <div className="text-sm text-gray-800 font-medium">
                      {order.customerName || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail || "N/A"}
                    </div>
                    {order.shippingAddress?.phone && (
                      <div className="text-sm text-gray-500 mt-1">
                        Phone: {order.shippingAddress.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                      <MapPin size={12} /> Delivery Destination
                    </h3>
                    <div className="text-sm text-gray-800">
                      <p>{order.shippingAddress?.address || "N/A"}</p>
                      <p className="text-gray-500">
                        {order.shippingAddress?.city || ""}, {order.shippingAddress?.country || ""} {order.shippingAddress?.zip || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                      <Route size={12} /> Shipping details
                    </h3>
                    <div className="text-sm text-gray-800">
                      Method: {order.shippingSnapshot?.type || "N/A"} / {order.shippingSnapshot?.method || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Estimated Time: {order.shippingSnapshot?.estimatedDays || 0} days
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Payment Status: <span className="uppercase text-emerald-600 font-semibold text-xs">{order.paymentStatus || "N/A"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-3">
                      Update Delivery Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {DELIVERY_FLOW.map((step) => {
                        const isDelivered = (order.workflowStatus || order.status) === "delivered";
                        return (
                          <button
                            key={step}
                            onClick={() => updateStatus(order._id, step)}
                            disabled={updatingId === order._id || isDelivered}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              (order.workflowStatus || order.status) === step
                                ? step === 'delivered' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {getOrderStatusLabel(step)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
