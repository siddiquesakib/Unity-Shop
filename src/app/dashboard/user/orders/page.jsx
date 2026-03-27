'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/contexts/SocketContext';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { downloadOrderInvoice } from '@/utils/generateInvoice';
import OrderTrackingModal from '@/components/common/OrderTrackingModal';
import { getOrderStatusLabel, normalizeToWorkflowStatus } from '@/utils/orderLifecycle';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://unity-shop-server.vercel.app';

function resolveOrderId(order) {
  if (!order) return '';
  if (typeof order._id === 'string') return order._id;
  if (order?._id?.$oid) return String(order._id.$oid);
  return '';
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

const getStatusColor = status => {
  const workflow = normalizeToWorkflowStatus(status);
  switch (workflow) {
    case 'placed':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'confirmed':
    case 'packed':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'picked':
    case 'inTransit':
    case 'outForDelivery':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'delivered':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'cancelled':
      return 'bg-red-50 text-red-600 border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const getStatusIcon = status => {
  const workflow = normalizeToWorkflowStatus(status);
  switch (workflow) {
    case 'placed':
      return <Clock size={14} />;
    case 'confirmed':
    case 'packed':
      return <Package size={14} />;
    case 'picked':
    case 'inTransit':
    case 'outForDelivery':
      return <Truck size={14} />;
    case 'delivered':
      return <CheckCircle size={14} />;
    case 'cancelled':
      return <XCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

// Orders that can still be tracked (not cancelled)
const isTrackable = status => normalizeToWorkflowStatus(status) !== 'cancelled';
const canUserCancel = status => ['placed', 'confirmed'].includes(normalizeToWorkflowStatus(status));

export default function UserOrdersPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState('');

  // Tracking modal state
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
          rows.map(order => ({
            ...order,
            workflowStatus: normalizeToWorkflowStatus(
              order.workflowStatus || order.status,
            ),
          })),
        );
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;

    const handleTrackingUpdated = () => {
      fetchOrders();
    };

    socket.on('orderTrackingUpdated', handleTrackingUpdated);
    return () => {
      socket.off('orderTrackingUpdated', handleTrackingUpdated);
    };
  }, [socket, fetchOrders]);

  const statuses = ['All', 'placed', 'confirmed', 'packed', 'picked', 'inTransit', 'outForDelivery', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.productName || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.sellerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.transitionId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      normalizeToWorkflowStatus(order.workflowStatus || order.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.amountPaid) || 0),
    0,
  );

  const handleCancelOrder = async order => {
    const targetId = resolveOrderId(order);
    if (!targetId || cancellingId) return;

    const ok = window.confirm(
      'Are you sure you want to cancel this order? This cannot be undone from your side.',
    );
    if (!ok) return;

    try {
      const token = getToken();
      if (!token) {
        alert('Please login again.');
        return;
      }

      setCancellingId(targetId);

      const res = await fetch(`${API_BASE}/orders/track/${targetId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || 'Failed to cancel order');
      }

      setOrders(prev =>
        prev.map(item =>
          resolveOrderId(item) === targetId
            ? {
                ...item,
                status: payload?.workflowStatus || 'cancelled',
                workflowStatus: payload?.workflowStatus || 'cancelled',
              }
            : item,
        ),
      );

      setSelectedOrder(prev =>
        prev && resolveOrderId(prev) === targetId
          ? {
              ...prev,
              status: payload?.workflowStatus || 'cancelled',
              workflowStatus: payload?.workflowStatus || 'cancelled',
            }
          : prev,
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId('');
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Filters */}
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
              placeholder="Search by product, seller, or transaction ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                {status === 'All' ? 'All' : getOrderStatusLabel(status)}
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
            <p className="text-gray-500 text-lg mb-2">
              {orders.length === 0
                ? 'No orders yet'
                : 'No orders match your filters'}
            </p>
            <p className="text-gray-400 text-sm">
              {orders.length === 0
                ? 'Your purchase history will appear here.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-4 pl-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr
                    key={resolveOrderId(order) || order.transitionId}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <span className="text-sm font-mono text-gray-900">
                        #
                        {(order.transitionId || order._id)
                          .slice(-8)
                          .toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-700 truncate max-w-[180px] block">
                        {order.productName || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {order.sellerName || 'N/A'}
                    </td>
                    <td className="py-4 text-sm font-semibold text-emerald-600">
                      ${Number(order.amountPaid || 0).toFixed(2)}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )
                        : 'N/A'}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.workflowStatus || order.status)}`}
                      >
                        {getStatusIcon(order.workflowStatus || order.status)}
                        {getOrderStatusLabel(order.workflowStatus || order.status)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* ── Track Button (NEW) ── */}
                        {isTrackable(order.workflowStatus || order.status) && (
                          <button
                            onClick={() => setTrackingOrderId(resolveOrderId(order))}
                            title="Track Order"
                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <MapPin size={16} />
                          </button>
                        )}
                        {canUserCancel(order.workflowStatus || order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            title="Cancel Order"
                            disabled={cancellingId === resolveOrderId(order)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => downloadOrderInvoice(order)}
                          title="Download Invoice"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
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

      {/* ── Order Detail Modal (existing) ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white border border-gray-200 rounded-2xl p-8 max-w-lg w-[90%] shadow-2xl"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <XCircle size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Order Details
            </h3>
            <button
              onClick={() => downloadOrderInvoice(selectedOrder)}
              className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-medium transition-colors"
            >
              <Download size={16} />
              Download Invoice PDF
            </button>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="text-gray-900 font-mono text-sm">
                  #
                  {(selectedOrder.transitionId || selectedOrder._id)
                    .slice(-8)
                    .toUpperCase()}
                </span>
              </div>
              {selectedOrder.transitionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {selectedOrder.transitionId}
                  </span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>
                <span className="text-gray-900">
                  {selectedOrder.productName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seller</span>
                <span className="text-gray-900">
                  {selectedOrder.sellerName || 'N/A'}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="text-emerald-600 font-bold">
                  ${Number(selectedOrder.amountPaid || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.workflowStatus || selectedOrder.status)}`}
                >
                  {getStatusIcon(selectedOrder.workflowStatus || selectedOrder.status)}
                  {getOrderStatusLabel(selectedOrder.workflowStatus || selectedOrder.status)}
                </span>
              </div>
              {/* Track button inside detail modal too */}
              {isTrackable(selectedOrder.workflowStatus || selectedOrder.status) && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setTrackingOrderId(resolveOrderId(selectedOrder));
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-black text-sm font-medium transition-colors"
                >
                  <MapPin size={15} />
                  Track This Order
                </button>
              )}
              {canUserCancel(selectedOrder.workflowStatus || selectedOrder.status) && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder)}
                  disabled={cancellingId === resolveOrderId(selectedOrder)}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                  {cancellingId === resolveOrderId(selectedOrder) ? 'Cancelling...' : 'Cancel This Order'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Order Tracking Modal (NEW) ── */}
      {trackingOrderId && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}
