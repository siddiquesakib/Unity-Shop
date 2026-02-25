"use client";

import { useState } from "react";

/**
 * Reusable PaymentButton Component (Next.js)
 *
 * Usage:
 * <PaymentButton
 *   price={29.99}
 *   productId="abc123"
 *   quantity={1}
 *   productName="Wireless Headphones"
 *   userEmail={currentUser.email}
 *   sellerName="Tech Store"
 *   sellerEmail="seller@techstore.com"
 * />
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function PaymentButton({
  price,
  productId,
  quantity = 1,
  productName,
  userEmail,
  sellerName,
  sellerEmail,
  label = "Buy Now",
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (
      !price ||
      !productId ||
      !productName ||
      !userEmail ||
      !sellerName ||
      !sellerEmail
    ) {
      setError("Missing required payment information.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price,
            productId,
            quantity,
            productName,
            userEmail,
            sellerName,
            sellerEmail,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error || "Failed to create checkout session.");
      }

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`
          relative w-full overflow-hidden
          inline-flex items-center justify-center gap-3
          px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase
          bg-black text-white
          shadow-xl shadow-black/10
          hover:bg-gray-900 hover:scale-[1.01] transition-all duration-300
          active:scale-[0.98]
          disabled:opacity-70 disabled:pointer-events-none
          ${className}
        `}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span className="font-semibold">Processing...</span>
          </>
        ) : (
          <>
            <span className="font-bold">{label}</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/* <PaymentButton
          price={product.price}
          productId={product._id}
          quantity={quantity}
          productName={product.name}
          userEmail={currentUser.email}
          sellerName={product.sellerName}
          sellerEmail={product.sellerEmail}
        /> */
//
