"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Truck,
  MapPin,
  Phone,
  CreditCard,
  Box,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function DeliveryOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    if (user?._id) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/my-deliveries/${user._id}`,
        );
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Update Status Function
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/track/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="text-blue-600" /> My Delivery Tasks
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            No orders assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID:{" "}
                    <span className="font-mono text-gray-900 font-medium">
                      #{order._id.slice(-6)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.userName || order.name}
                        </p>
                        <p className="text-sm text-gray-600">{order.address}</p>
                        <p className="text-sm text-gray-600">
                          {order.city}, {order.zip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={18} />
                      <a
                        href={`tel:${order.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Order Info & Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Order Info
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="text-gray-400" size={18} />
                      <span className="text-gray-700 font-medium">
                        {order.totalAmount} BDT
                      </span>
                      <span className="text-xs text-gray-500">
                        ({order.paymentMethod})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Box className="text-gray-400" size={18} />
                      <span className="text-gray-700">
                        {order.cartItems?.length || 0} items
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3 font-medium uppercase">
                      Update Status
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.status !== "Delivered" &&
                        order.status !== "Cancelled" && (
                          <>
                            <button
                              onClick={() => updateStatus(order._id, "Shipped")}
                              disabled={order.status === "Shipped"}
                              className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors
                              ${
                                order.status === "Shipped"
                                  ? "bg-blue-50 text-blue-600 border-blue-200 cursor-default"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              Step 1: Out for Delivery
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(order._id, "Delivered")
                              }
                              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={16} /> Marked as Delivered
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(order._id, "Cancelled")
                              }
                              className="px-4 py-2 text-sm rounded-lg text-red-600 border border-red-200 font-medium hover:bg-red-50 transition-colors ml-auto"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                      {order.status === "Delivered" && (
                        <div className="w-full bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                          ✅ Delivery Completed
                        </div>
                      )}
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
