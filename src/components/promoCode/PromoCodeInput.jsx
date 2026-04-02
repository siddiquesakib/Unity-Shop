'use client';

import { useState } from 'react';
import { FiTag, FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * PromoCodeInput — calls real backend POST /promo/validate
 *
 * Props:
 *   subtotal   (number)   — current cart subtotal, used for minOrder checks
 *   onApply    (fn)       — called with { code, discount, description } when valid
 *   onRemove   (fn)       — called when the applied code is cleared
 */
export default function PromoCodeInput({ subtotal = 0, onApply, onRemove }) {
  const [inputValue, setInputValue] = useState('');
  const [appliedCode, setAppliedCode] = useState(null); // { code, discount, description }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // ── Apply ──────────────────────────────────────────────────────────────────
  const handleApply = async () => {
    const code = inputValue.trim().toUpperCase();

    if (!code) {
      triggerShake();
      setError('Please enter a promo code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();

      if (!data.valid) {
        triggerShake();
        setError(data.error || 'Invalid promo code.');
        return;
      }

      const applied = {
        code: data.code,
        discount: data.discount,
        description: data.description,
      };

      setAppliedCode(applied);
      setInputValue('');
      onApply?.(applied);
    } catch (err) {
      triggerShake();
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Remove ─────────────────────────────────────────────────────────────────
  const handleRemove = () => {
    setAppliedCode(null);
    setError('');
    onRemove?.();
  };

  // ── Shake animation on error ───────────────────────────────────────────────
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // ── Keyboard enter ─────────────────────────────────────────────────────────
  const handleKeyDown = e => {
    if (e.key === 'Enter') handleApply();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Promo Code
      </p>

      {/* ── Applied state ── */}
      {appliedCode ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <FiCheck className="text-emerald-500 flex-shrink-0" size={15} />
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                {appliedCode.code}
              </p>
              <p className="text-xs text-emerald-600">
                {appliedCode.description} — saving{' '}
                <span className="font-bold">
                  ${appliedCode.discount.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-emerald-400 hover:text-red-500 transition ml-2 flex-shrink-0"
            title="Remove promo code"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        /* ── Input state ── */
        <div
          className={`flex transition-all duration-150 ${
            shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
          }`}
        >
          <div className="relative flex-1">
            <FiTag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter code (e.g. UNITY10)"
              disabled={loading}
              className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-l-xl focus:outline-none focus:ring-2 transition
                disabled:opacity-60 disabled:cursor-not-allowed
                ${
                  error
                    ? 'border-red-300 focus:ring-red-200 text-black'
                    : 'border-gray-200 focus:ring-gray-300 focus:border-black text-gray-800'
                }`}
            />
          </div>
          <button
            onClick={handleApply}
            disabled={loading || !inputValue.trim()}
            className="px-5 py-2.5 bg-black hover:bg-gray-800 active:scale-95 text-white text-sm font-bold
              rounded-r-xl transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {loading ? (
              <FiLoader size={15} className="animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        </div>
      )}

      {/* ── Error message ── */}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <FiAlertCircle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
