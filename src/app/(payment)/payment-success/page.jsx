"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  const { clearCart } = useCart();

  const [status, setStatus] = useState("loading");
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

        clearCart();

        setOrder(data);
        setStatus('success');
      } catch (err) {
        setErrorMsg(err.message || 'Something went wrong.');
        setStatus('error');
      }
    };

    fetchOrder();
  }, [sessionId, clearCart]);

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'success') return <SuccessView order={order} />;
  if (status === 'already') return <AlreadyView />;
  if (status === 'error') return <ErrorView message={errorMsg} />;
}

function SuccessView({ order }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="bg-black px-8 pt-10 pb-8 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center ring-4 ring-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
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
              <h1 className="text-3xl font-black tracking-tight">
                Payment Successful!
              </h1>
              <p className="mt-2 text-gray-400 text-sm">
                Thank you for your order. A confirmation has been sent to your
                email.
              </p>
            </div>
          </div>

          {/* Order details */}
          {order && (
            <div className="px-6 pt-6 pb-2 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
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
                  <span className="inline-flex items-center gap-1.5 text-black font-bold capitalize">
                    <span className="w-2 h-2 rounded-full bg-black" />
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
              className="flex-1 text-center py-3.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
            >
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 text-center py-3.5 rounded-full border-2 border-gray-200 hover:border-black text-gray-700 hover:text-black font-bold text-sm transition-all duration-300"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlreadyView() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xl font-black text-black">i</span>
        </div>
        <h2 className="text-2xl font-black text-black mb-2 tracking-tight">
          Already Processed
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          This payment was already recorded. No duplicate entry was created.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorView({ message }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
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
        <h2 className="text-2xl font-black text-black mb-2 tracking-tight">
          Something Went Wrong
        </h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
      <p className="text-gray-400 text-sm font-medium">
        Confirming your payment…
      </p>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span
        className={`text-sm ${bold ? "text-black font-black text-base" : "text-gray-700 font-medium"}`}
        className={`text-sm ${
          bold
            ? 'text-emerald-600 font-bold text-base'
            : 'text-slate-700 font-medium'
        }`}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}
