'use client';

/**
 * PaymentSuccess Page
 * File location: app/payment-success/page.jsx
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Required: wrap in Suspense because of useSearchParams
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg('No session ID found in the URL.');
      setStatus('error');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/payment/retrivedsessionAfterPayment?session_id=${sessionId}`,
          { method: 'PATCH' },
        );

        const data = await res.json();

        if (data?.message === 'Order already processed.') {
          setStatus('already');
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || 'Could not verify payment.');
        }

        setOrder(data);
        setStatus('success');
      } catch (err) {
        setErrorMsg(err.message || 'Something went wrong.');
        setStatus('error');
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'success') return <SuccessView order={order} />;
  if (status === 'already') return <AlreadyView />;
  if (status === 'error') return <ErrorView message={errorMsg} />;
}

// ─── Views ────────────────────────────────────────────────────────────────────

function SuccessView({ order }) {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 px-8 pt-10 pb-8 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-2 text-emerald-100 text-sm">
            Thank you for your order. A confirmation has been sent to your
            email.
          </p>
        </div>

        {/* Order details */}
        {order && (
          <div className="px-6 pt-6 pb-2 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Order Summary
            </p>
            <Row label="Product" value={order.metadata?.productName} />
            <Row label="Seller" value={order.metadata?.sellerName} />
            <Row
              label="Amount Paid"
              value={`$${(Number(order.metadata?.paidAmount) || 0).toFixed(2)}`}
              bold
            />
            <Row
              label="Status"
              value={
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold capitalize">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {order.payment_status}
                </span>
              }
            />
            <Row label="Email" value={order.customer_email} />
          </div>
        )}

        {/* Buttons */}
        <div className="px-6 py-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 text-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors"
          >
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function AlreadyView() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
          i
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Already Processed
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          This payment was already recorded. No duplicate entry was created.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorView({ message }) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Something Went Wrong
        </h2>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
      <p className="text-slate-500 text-sm">Confirming your payment…</p>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm ${bold ? 'text-emerald-600 font-bold text-base' : 'text-slate-700 font-medium'}`}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}
