'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const { data: session } = useSession();
  const { clearCart } = useCart();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/dashboard/user/orders');
      return;
    }

    const handlePaymentSuccess = async () => {
      try {
        console.log('✓ Processing payment...');

        // 1. Verify payment with backend
        const res = await fetch(
          `${API_BASE}/payment/retrivedsessionAfterPayment?session_id=${sessionId}`,
          { method: 'PATCH' },
        );

        const data = await res.json();
        console.log('Payment verification response:', data);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          throw new Error("Please log in again to verify your payment.");
        }

        const res = await fetch(
          `${API_BASE}/payment/retrivedsessionAfterPayment?session_id=${sessionId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json().catch(() => ({}));

        if (!res.ok && data?.message !== 'Order already processed.') {
          throw new Error(data?.error || 'Payment verification failed');
        }

        console.log('✓ Payment verified, clearing cart...');

        // 2. Clear cart from frontend
        const userId = session?.user?.id || session?.user?._id;
        if (userId) {
          try {
            await clearCart(userId);
            console.log('✓ Cart cleared');
          } catch (err) {
            console.error('Cart clearing error:', err);
            // Continue anyway - don't block redirect
          }
        }

        console.log('✓ Redirecting to orders...');
        setProcessing(false);

        // 3. Redirect to orders page
        router.replace('/dashboard/user/orders');
      } catch (err) {
        console.error('Payment processing error:', err);
        setProcessing(false);
        // Still redirect to orders even on error
        router.replace('/dashboard/user/orders');
      }
    };

    handlePaymentSuccess();
  }, [sessionId, router, session, clearCart]);

  if (processing) {
    return <LoadingSpinner />;
  }

  return null;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-black animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Processing your payment...</p>
      </div>
    </div>
  );
}
