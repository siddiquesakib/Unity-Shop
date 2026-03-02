'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
  FiTag,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiUsers,
  FiPercent,
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
} from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const EMPTY_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  description: '',
  minOrder: '',
  maxUses: '',
  expiresAt: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatus(promo) {
  if (!promo.isActive) return { label: 'Inactive', color: 'gray' };
  if (promo.expiresAt && new Date() > new Date(promo.expiresAt))
    return { label: 'Expired', color: 'red' };
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses)
    return { label: 'Maxed Out', color: 'orange' };
  return { label: 'Active', color: 'green' };
}

const STATUS_STYLES = {
  green: 'bg-green-50 text-green-700 border-green-200',
  gray: 'bg-gray-100 text-gray-500 border-gray-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium
        ${
          type === 'success'
            ? 'bg-white border-green-200 text-green-800'
            : 'bg-white border-red-200 text-red-700'
        }`}
    >
      {type === 'success' ? (
        <FiCheck className="text-green-500" size={16} />
      ) : (
        <FiAlertCircle className="text-red-500" size={16} />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
        <FiX size={14} />
      </button>
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function FormModal({ form, setForm, onSubmit, onClose, isEditing, loading }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <FiTag className="text-white" size={15} />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              {isEditing ? 'Edit Promo Code' : 'Create New Promo Code'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Promo Code *
            </label>
            <input
              required
              disabled={isEditing}
              value={form.code}
              onChange={e =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g. UNITY20"
              maxLength={20}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono tracking-widest
                focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400
                disabled:bg-gray-50 disabled:text-gray-400 transition-all"
            />
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">
                Code cannot be changed after creation.
              </p>
            )}
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Discount Type *
              </label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                  focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Value *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {form.type === 'percentage' ? '%' : '$'}
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  max={form.type === 'percentage' ? 100 : undefined}
                  step="0.01"
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === 'percentage' ? '20' : '50.00'}
                  className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. 20% off summer sale"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />
          </div>

          {/* Min Order + Max Uses */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Min Order ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.minOrder}
                onChange={e => setForm({ ...form, minOrder: e.target.value })}
                placeholder="No minimum"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Max Uses
              </label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={e => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              value={form.expiresAt}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank = never expires
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600
                rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-bold bg-black text-white
                rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PromoCodeGenerator() {
  const [promos, setPromos] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const notify = (message, type = 'success') => setToast({ message, type });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchPromos = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_BASE}/promo/admin`);
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch {
      notify('Failed to load promo codes.', 'error');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // ── Create / Update ──────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      description: form.description.trim(),
      minOrder: form.minOrder ? Number(form.minOrder) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };

    try {
      if (editId) {
        const { code, ...updatePayload } = payload;
        await fetch(`${API_BASE}/promo/admin/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });
        notify('Promo code updated!');
      } else {
        const res = await fetch(`${API_BASE}/promo/admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Failed to create promo code.', 'error');
          return;
        }
        notify(`Promo code "${payload.code}" created!`);
      }

      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchPromos();
    } catch {
      notify('Something went wrong.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────
  const handleToggle = async promo => {
    try {
      await fetch(`${API_BASE}/promo/admin/${promo._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      notify(
        `"${promo.code}" ${!promo.isActive ? 'activated' : 'deactivated'}.`,
      );
      fetchPromos();
    } catch {
      notify('Failed to toggle.', 'error');
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async promo => {
    if (!window.confirm(`Delete "${promo.code}" permanently?`)) return;
    try {
      await fetch(`${API_BASE}/promo/admin/${promo._id}`, { method: 'DELETE' });
      notify(`"${promo.code}" deleted.`);
      fetchPromos();
    } catch {
      notify('Failed to delete.', 'error');
    }
  };

  // ── Open edit ────────────────────────────────────────────────────────────
  const openEdit = promo => {
    setForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      description: promo.description || '',
      minOrder: promo.minOrder ?? '',
      maxUses: promo.maxUses ?? '',
      expiresAt: promo.expiresAt
        ? new Date(promo.expiresAt).toISOString().split('T')[0]
        : '',
    });
    setEditId(promo._id);
    setShowModal(true);
  };

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = promos.filter(p => {
    const matchesSearch =
      p.code.includes(search.toUpperCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());

    const status = getStatus(p);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && status.label === 'Active') ||
      (filter === 'inactive' && status.label === 'Inactive') ||
      (filter === 'expired' && status.label === 'Expired');

    return matchesSearch && matchesFilter;
  });

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    total: promos.length,
    active: promos.filter(p => getStatus(p).label === 'Active').length,
    inactive: promos.filter(p => !p.isActive).length,
    totalUses: promos.reduce((s, p) => s + (p.usedCount || 0), 0),
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <FormModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setForm(EMPTY_FORM);
            setEditId(null);
          }}
          isEditing={!!editId}
          loading={formLoading}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Promo Codes
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create and manage discount codes for your customers
            </p>
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditId(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold
              rounded-full hover:bg-gray-800 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <FiPlus size={16} />
            New Promo Code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Codes', value: stats.total, icon: FiTag },
            {
              label: 'Active',
              value: stats.active,
              icon: FiCheck,
              color: 'text-green-600',
            },
            {
              label: 'Inactive',
              value: stats.inactive,
              icon: FiToggleLeft,
              color: 'text-gray-400',
            },
            { label: 'Total Uses', value: stats.totalUses, icon: FiUsers },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-200 px-5 py-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {label}
                </span>
                <Icon size={15} className={color || 'text-gray-300'} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by code or description…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'inactive', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl capitalize transition-all
                  ${
                    filter === f
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={fetchPromos}
              className="px-3 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl
                hover:border-gray-400 transition-all"
              title="Refresh"
            >
              <FiRefreshCw
                size={14}
                className={fetching ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
              <FiRefreshCw size={18} className="animate-spin" />
              <span className="text-sm">Loading promo codes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                <FiTag size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium">No promo codes found</p>
              {search || filter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearch('');
                    setFilter('all');
                  }}
                  className="text-xs text-black underline underline-offset-2"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs text-black underline underline-offset-2"
                >
                  Create your first promo code
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      'Code',
                      'Discount',
                      'Min Order',
                      'Uses',
                      'Expires',
                      'Status',
                      'Actions',
                    ].map(h => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(promo => {
                    const status = getStatus(promo);
                    return (
                      <tr
                        key={promo._id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* Code */}
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-mono font-bold text-gray-900 tracking-wider">
                              {promo.code}
                            </span>
                            {promo.description && (
                              <p className="text-xs text-gray-400 mt-0.5 max-w-[160px] truncate">
                                {promo.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Discount */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                            {promo.type === 'percentage' ? (
                              <>
                                <FiPercent
                                  size={13}
                                  className="text-gray-400"
                                />
                                {promo.value}% off
                              </>
                            ) : (
                              <>
                                <FiDollarSign
                                  size={13}
                                  className="text-gray-400"
                                />
                                {promo.value} off
                              </>
                            )}
                          </span>
                        </td>

                        {/* Min Order */}
                        <td className="px-5 py-4 text-gray-500">
                          {promo.minOrder
                            ? `$${promo.minOrder.toFixed(2)}`
                            : '—'}
                        </td>

                        {/* Uses */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold">
                              {promo.usedCount}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-400">
                              {promo.maxUses ?? '∞'}
                            </span>
                          </div>
                          {promo.maxUses && (
                            <div className="mt-1.5 w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-black rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, (promo.usedCount / promo.maxUses) * 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </td>

                        {/* Expires */}
                        <td className="px-5 py-4 text-gray-500">
                          {promo.expiresAt ? (
                            <span className="flex items-center gap-1.5">
                              <FiClock size={13} className="text-gray-300" />
                              {new Date(promo.expiresAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                          ) : (
                            'Never'
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                              ${STATUS_STYLES[status.color]}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleToggle(promo)}
                              title={promo.isActive ? 'Deactivate' : 'Activate'}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
                            >
                              {promo.isActive ? (
                                <FiToggleRight
                                  size={18}
                                  className="text-green-500"
                                />
                              ) : (
                                <FiToggleLeft size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => openEdit(promo)}
                              title="Edit"
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <FiEdit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(promo)}
                              title="Delete"
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center pb-2">
          Promo codes are validated at checkout against the cart subtotal. Usage
          count increments automatically after successful payment.
        </p>
      </div>
    </div>
  );
}
