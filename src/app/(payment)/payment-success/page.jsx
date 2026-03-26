'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<FullPageSpinner label="Confirming your payment…" />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();

  const { clearCart } = useCart();
  const { fetchNotifications } = useNotifications() || {};

  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      // No session — just go to orders, nothing to verify
      router.replace('/dashboard/user/orders');
      return;
    }

    const processPayment = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/payment/retrivedsessionAfterPayment?session_id=${sessionId}`,
          { method: 'PATCH' },
        );

        const data = await res.json();

        // "Already processed" is still a success — just redirect
        if (data?.message === 'Order already processed.') {
          router.replace('/dashboard/user/orders');
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || 'Could not verify payment.');
        }

        // Clear cart and refresh notifications before navigating
        clearCart();

        if (fetchNotifications) {
          setTimeout(() => fetchNotifications(), 1000);
        }

        router.replace('/dashboard/user/orders');
      } catch (err) {
        // On error, stay on page and show a message with a fallback link
        setError(err.message || 'Something went wrong verifying your payment.');
      }
    };

    processPayment();
  }, [sessionId, clearCart, fetchNotifications, router]);

  if (error) return <ErrorView message={error} />;

  return <FullPageSpinner label="Confirming your payment…" />;
}

/* ─── Minimal spinner shown during processing ─────────────────────── */
function FullPageSpinner({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen bg-[#f7f6f3] flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  );
}

/* ─── Only shown if the API call actually fails ───────────────────── */
function ErrorView({ message }) {
  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center p-6">
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
          Payment Verification Failed
        </h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <p className="text-gray-400 text-xs mb-6">
          Your payment may still have gone through. Check your orders page or
          contact support.
        </p>
        <a
          href="/dashboard/user/orders"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
        >
          Go to My Orders
        </a>
      </div>
    </div>
  );
}
