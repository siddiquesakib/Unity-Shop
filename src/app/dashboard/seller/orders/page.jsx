"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Search, CheckCircle } from "lucide-react";
import {
  getOrderStatusLabel,
  normalizeToWorkflowStatus,
} from "@/utils/orderLifecycle";
import { useCurrency } from "@/contexts/CurrencyContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const STATUS_COLOR = {
  placed: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-amber-100 text-amber-700",
  picked: "bg-purple-100 text-purple-700",
  inTransit: "bg-indigo-100 text-indigo-700",
  outForDelivery: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState("");
  const { formatPrice } = useCurrency();

  const fetchOrders = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(
        `${API_BASE}/orders?sellerEmail=${encodeURIComponent(user.email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
    } catch (error) {
      // console.error("Failed to fetch seller orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email]);

  const markPacked = async (orderId) => {
    setUpdating(orderId);
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
          status: "packed",
          actorRole: "seller",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to update order");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: "packed", workflowStatus: "packed" }
            : o,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update status");
    } finally {
      setUpdating("");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      (order.orderCode || "").toLowerCase().includes(q) ||
      (order.customerName || "").toLowerCase().includes(q) ||
      (order.customerEmail || "").toLowerCase().includes(q)
    );
  });

  console.log("Seller Orders:", orders);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Orders</h1>
        <p className="text-gray-500">Seller can only move status to packed.</p>
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
          placeholder="Search by order code, customer name, email"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Product / Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  {/* <th className="px-4 py-3 text-left">Shipping</th> */}
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-2">
                        {order.productName || "Product Name N/A"}
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        {order.orderCode || `#${String(order._id).slice(-6)}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{order.customerName || "N/A"}</div>
                      <div className="text-xs text-gray-500">
                        {order.customerEmail || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {formatPrice(Number(order.amountPaid || 0).toFixed(2))}
                    </td>
                    {/* <td className="px-4 py-3 text-xs text-gray-600">
                      {order.shippingSnapshot?.type || "N/A"} /{" "}
                      {order.shippingSnapshot?.method || "N/A"}
                    </td> */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {getOrderStatusLabel(
                          order.status || order.status || "Placed",
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => markPacked(order._id)}
                        disabled={
                          updating === order._id ||
                          (order.workflowStatus || order.status) !==
                            "confirmed" ||
                          (order.workflowStatus || order.status) === "delivered"
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 disabled:opacity-50"
                      >
                        <CheckCircle size={14} />
                        Mark Packed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
