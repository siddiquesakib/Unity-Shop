// components/dashboard/OrderTrackingModal.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  RefreshCw,
} from 'lucide-react';
import { getOrderStatusLabel, normalizeToWorkflowStatus } from '@/utils/orderLifecycle';
import { useSocket } from '@/contexts/SocketContext';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://unity-shop-server.vercel.app';

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'picked', 'inTransit', 'outForDelivery', 'delivered'];

const STEP_CONFIG = {
  placed: {
    label: 'Order Confirmed',
    icon: Clock,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    dot: 'bg-purple-500',
  },
  confirmed: {
    label: 'Manager Approved',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  packed: {
    label: 'Being Packed',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  picked: {
    label: 'Picked',
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  inTransit: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  outForDelivery: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OrderTrackingModal({ orderId, onClose }) {
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Missing auth token');

      const res = await fetch(`${API_BASE}/orders/track/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      const statusHistory = Array.isArray(data.statusHistory)
        ? data.statusHistory.map(item => ({
            ...item,
            status: normalizeToWorkflowStatus(item.status),
          }))
        : [];
      setOrder({
        ...data,
        workflowStatus: normalizeToWorkflowStatus(data.workflowStatus || data.status),
        statusHistory,
      });
    } catch (err) {
      setError('Could not load tracking info. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  useEffect(() => {
    if (!socket || !orderId) return;

    const handleTrackingUpdate = (payload) => {
      const updatedOrderId = String(payload?.orderId || '');
      if (updatedOrderId && updatedOrderId === String(orderId)) {
        fetchOrder();
      }
    };

    socket.on('orderTrackingUpdated', handleTrackingUpdate);
    return () => {
      socket.off('orderTrackingUpdated', handleTrackingUpdate);
    };
  }, [socket, orderId, fetchOrder]);

  const isCancelled = normalizeToWorkflowStatus(order?.workflowStatus || order?.status) === 'cancelled';
  const currentStepIndex = isCancelled
    ? -1
    : STATUS_STEPS.indexOf(normalizeToWorkflowStatus(order?.workflowStatus || order?.status));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Track Order</h2>
              {order && (
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  #{(order.transitionId || order._id).slice(-8).toUpperCase()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrder}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
                title="Refresh"
              >
                <RefreshCw
                  size={15}
                  className={loading ? 'animate-spin' : ''}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-10">
                <XCircle size={36} className="mx-auto text-red-300 mb-3" />
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                  onClick={fetchOrder}
                  className="mt-4 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && order && (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    <Package size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order.productName || 'Your Order'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Seller: {order.sellerName || 'UnityShop'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">
                    ${Number(order.amountPaid || 0).toFixed(2)}
                  </p>
                </div>

                {/* Cancelled Banner */}
                {isCancelled && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <XCircle size={18} className="text-red-500 shrink-0" />
                    <p className="text-sm font-semibold text-red-600">
                      This order has been cancelled.
                    </p>
                  </div>
                )}

                {/* Stepper */}
                {!isCancelled && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                      Order Progress
                    </p>
                    <div className="relative">
                      {/* Line background */}
                      <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-gray-200" />
                      {/* Line fill based on progress */}
                      <div
                        className="absolute left-[18px] top-5 w-0.5 bg-black transition-all duration-700"
                        style={{
                          height:
                            currentStepIndex <= 0
                              ? '0%'
                              : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />

                      <div className="space-y-7">
                        {STATUS_STEPS.map((step, index) => {
                          const config = STEP_CONFIG[step];
                          const Icon = config.icon;
                          const isCompleted = index < currentStepIndex;
                          const isActive = index === currentStepIndex;
                          const isPending = index > currentStepIndex;
                          const historyEntry = order.statusHistory?.find(
                            h => normalizeToWorkflowStatus(h.status) === step,
                          );

                          return (
                            <motion.div
                              key={step}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.08 }}
                              className="flex items-start gap-4 relative"
                            >
                              {/* Circle */}
                              <div
                                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-black border-black'
                                    : isActive
                                      ? `${config.bg} ${config.border}`
                                      : 'bg-white border-gray-200'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle
                                    size={16}
                                    className="text-white"
                                  />
                                ) : (
                                  <Icon
                                    size={15}
                                    className={
                                      isActive ? config.color : 'text-gray-300'
                                    }
                                  />
                                )}
                                {isActive && (
                                  <span
                                    className={`absolute inset-0 rounded-full ${config.bg} animate-ping opacity-40`}
                                  />
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between">
                                  <p
                                    className={`text-sm font-semibold ${
                                      isCompleted || isActive
                                        ? 'text-gray-900'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                      {getOrderStatusLabel(step)}
                                  </p>
                                  {isActive && (
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
                                    >
                                      Current
                                    </span>
                                  )}
                                </div>
                                {historyEntry?.updatedAt ? (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {formatDate(historyEntry.updatedAt)}
                                  </p>
                                ) : (
                                  isPending && (
                                    <p className="text-xs text-gray-300 mt-0.5">
                                      Pending
                                    </p>
                                  )
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500">
                      Estimated Delivery
                    </span>
                    <span className="ml-auto text-xs font-semibold text-gray-900">
                      {formatDateShort(order.estimatedDeliveryDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Truck size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500">
                      Delivery Partner
                    </span>
                    <span className="ml-auto text-xs font-semibold text-gray-900">
                      {order.deliveryPartner || 'Pathao Courier'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <User size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500">Order Placed</span>
                    <span className="ml-auto text-xs font-semibold text-gray-900">
                      {formatDateShort(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Activity Log */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Activity Log
                    </p>
                    <div className="space-y-2">
                      {[...order.statusHistory].reverse().map((entry, i) => {
                        const config =
                          STEP_CONFIG[entry.status] || STEP_CONFIG['New'];
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2.5"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${config.dot}`}
                            />
                            <div>
                              <p className="text-xs font-semibold text-gray-800">
                                {entry.label || config.label}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {formatDate(entry.updatedAt)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
