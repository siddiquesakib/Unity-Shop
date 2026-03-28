"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Truck, MapPin, CheckCircle, Clock, Route } from "lucide-react";
import { toast } from "react-hot-toast";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const DELIVERY_FLOW = ["picked", "inTransit", "outForDelivery", "delivered"];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function DeliveryOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

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
      setOrders(
        rows.map((o) => ({
          ...o,
          workflowStatus: normalizeToWorkflowStatus(o.workflowStatus || o.status),
        })),
      );
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

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="text-blue-600" /> My Assigned Deliveries
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No orders assigned to you yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    SubOrder: <span className="font-mono">{order.orderCode || `#${String(order._id).slice(-6)}`}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Assigned at {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {getOrderStatusLabel(order.workflowStatus || order.status)}
                </span>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                    Destination
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin size={16} className="mt-0.5 text-gray-400" />
                    <div>
                      <p>{order.shippingAddress?.address || "N/A"}</p>
                      <p>
                        {order.shippingAddress?.city || ""}, {order.shippingAddress?.country || ""} {order.shippingAddress?.zip || ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Route size={14} />
                    Shipping: {order.shippingSnapshot?.type || "N/A"} / {order.shippingSnapshot?.method || "N/A"} ({order.shippingSnapshot?.estimatedDays || 0} days)
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                    Status Update
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_FLOW.map((step) => (
                      <button
                        key={step}
                        onClick={() => updateStatus(order._id, step)}
                        disabled={updatingId === order._id || (order.workflowStatus || order.status) === "delivered"}
                        className="px-3 py-2 rounded-lg border text-xs font-semibold disabled:opacity-50"
                      >
                        {getOrderStatusLabel(step)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> Ownership enforced: only assigned delivery can update.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
