'use client';

/**
 * PaymentCancel Page
 * File location: app/payment-cancel/page.jsx
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-rose-400 to-pink-500 px-8 pt-10 pb-8 text-center text-white">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Payment Cancelled</h1>
          <p className="mt-2 text-rose-100 text-sm">
            No worries — you have not been charged at all.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 text-center">
          <p className="text-slate-500 text-sm leading-relaxed">
            You cancelled the checkout process. Your cart items are still saved
            and ready whenever you want to try again.
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-8 mt-6">
            <Badge emoji="🔒" label="Secure" />
            <Badge emoji="💳" label="No Charge" />
            <Badge emoji="↩️" label="Easy Returns" />
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold text-sm transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Badge({ emoji, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  );
}
