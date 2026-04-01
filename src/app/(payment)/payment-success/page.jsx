"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unityshop-server.onrender.com";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { clearCart } = useCart();
  const hasProcessedRef = useRef(false);
  const [stage, setStage] = useState("processing");
  const [detail, setDetail] = useState("Processing your payment...");

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    if (!sessionId) {
      setStage("error");
      setDetail("Missing payment session. Redirecting to orders...");
      setTimeout(() => router.replace("/dashboard/user/orders"), 1500);
      return;
    }

    const handlePaymentSuccess = async () => {
      try {
        // 1. Verify payment with backend
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

        if (!res.ok && data?.message !== "Order already processed.") {
          throw new Error(data?.error || "Payment verification failed");
        }

        // 2. Clear cart from frontend
        let storedUserId = null;
        if (typeof window !== "undefined") {
          try {
            const rawUser = localStorage.getItem("user");
            storedUserId = rawUser ? JSON.parse(rawUser)?._id : null;
          } catch (err) {
            console.warn("Failed to read user from localStorage:", err);
          }
        }

        const userId =
          session?.user?.id || session?.user?._id || storedUserId || null;
        try {
          await clearCart(userId);
        } catch (err) {
          console.error("Cart clearing error:", err);
          // Continue anyway - don't block redirect
        }

        setStage("success");
        setDetail("Payment verified. Redirecting to your orders...");

        // 3. Redirect to orders page
        setTimeout(() => router.replace("/dashboard/user/orders"), 2000);
      } catch (err) {
        console.error("Payment processing error:", err);
        setStage("error");
        setDetail(
          err?.message || "Payment verification failed. Redirecting...",
        );
        // Still redirect to orders even on error
        setTimeout(() => router.replace("/dashboard/user/orders"), 2500);
      }
    };

    handlePaymentSuccess();
  }, [sessionId, router, session, sessionStatus, clearCart]);

  if (stage === "processing") {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center ${
            stage === "success"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <span className="text-xl">✓</span>
        </div>
        <h1 className="text-lg font-black text-gray-900 mb-2">
          {stage === "success" ? "Payment Successful" : "Payment Update"}
        </h1>
        <p className="text-sm text-gray-600">{detail}</p>
      </div>
    </div>
  );
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
