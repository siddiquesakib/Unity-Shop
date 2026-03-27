"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Package, RefreshCw, Search, Truck } from "lucide-react";
import { getOrderStatusLabel, normalizeToWorkflowStatus } from "@/utils/orderLifecycle";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

const STATUS_OPTIONS = ["confirmed"];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function FulfillmentPage() {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [assignSelections, setAssignSelections] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setOrders([]);
        setDeliveryPersons([]);
        return;
      }

      const [ordersRes, deliveryRes] = await Promise.all([
        fetch(`${API_BASE}/orders/suborders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/users/role/delivery`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const ordersData = await ordersRes.json();
      const deliveryData = await deliveryRes.json();

      const rows = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];
      setOrders(
        rows.map((o) => ({
          ...o,
          workflowStatus: normalizeToWorkflowStatus(o.workflowStatus || o.status),
        })),
      );
      setDeliveryPersons(Array.isArray(deliveryData) ? deliveryData : []);
    } catch (error) {
      console.error("Failed to fetch manager fulfillment data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      return (
        (o.orderCode || "").toLowerCase().includes(q) ||
        (o.customerName || "").toLowerCase().includes(q) ||
        (o.customerEmail || "").toLowerCase().includes(q) ||
        (o.destination?.city || "").toLowerCase().includes(q) ||
        (o.sellerEmail || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
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
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update status");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status,
                workflowStatus: normalizeToWorkflowStatus(status),
              }
            : o,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Status update failed");
    } finally {
      setUpdatingId("");
    }
  };

  const assignDelivery = async (orderId) => {
    const deliveryManId = assignSelections[orderId];
    if (!deliveryManId) return;

    setUpdatingId(orderId);
    try {
      const token = getToken();
      if (!token) throw new Error("Missing auth token");

      const res = await fetch(`${API_BASE}/orders/assign/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryManId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Assignment failed");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                deliveryManId,
                status: data?.status || o.status,
                workflowStatus: normalizeToWorkflowStatus(data?.status || o.status),
              }
            : o,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Delivery assignment failed");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manager Fulfillment</h1>
          <p className="text-slate-400">
            All suborders with destination + shipping + delivery assignment.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-slate-400" : "text-slate-400"} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order, customer, city, seller"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="mx-auto mb-2" size={32} />
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th className="px-4 py-3 text-left">Shipping</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Assign Delivery</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-slate-800/70">
                    <td className="px-4 py-3 text-white font-medium">
                      {order.orderCode || `#${String(order._id).slice(-6)}`}
                      <div className="text-xs text-slate-500">{order.sellerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {order.customerName || "N/A"}
                      <div className="text-xs text-slate-500">{order.customerEmail || "N/A"}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      <div>{order.destination?.address || "N/A"}</div>
                      <div>
                        {order.destination?.city || ""}, {order.destination?.country || ""} {order.destination?.zip || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      <div>
                        {order.shippingDetails?.type || "N/A"} / {order.shippingDetails?.method || "N/A"}
                      </div>
                      <div>
                        Cost ${Number(order.shippingDetails?.cost || 0).toFixed(2)} · {order.shippingDetails?.estimatedDays || 0} days
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(order._id, STATUS_OPTIONS[0])}
                          disabled={updatingId === order._id || (order.workflowStatus || order.status) === "confirmed"}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs disabled:opacity-50"
                        >
                          Mark Confirmed
                        </button>
                        <span className="text-[10px] text-slate-500">
                          Current: {getOrderStatusLabel(order.workflowStatus || order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={assignSelections[order._id] || ""}
                          onChange={(e) =>
                            setAssignSelections((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                        >
                          <option value="">Select rider</option>
                          {deliveryPersons.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignDelivery(order._id)}
                          disabled={updatingId === order._id || !assignSelections[order._id]}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-200 disabled:opacity-50"
                        >
                          <Truck size={12} /> Assign
                        </button>
                      </div>
                      {order.deliveryManId && (
                        <p className="text-[10px] text-emerald-400 mt-1">Assigned: {order.deliveryManId}</p>
                      )}
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
