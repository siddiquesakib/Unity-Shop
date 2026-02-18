'use client';

import { useState } from 'react';

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PaymentButton({
  price,
  productId,
  quantity = 1,
  productName,
  userEmail,
  sellerName,
  sellerEmail,
  label = 'Buy Now',
  className = '',
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
      setError('Missing required payment information.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/payment/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        throw new Error(errData?.error || 'Failed to create checkout session.');
      }

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`
          inline-flex items-center justify-center gap-2
          px-6 py-3 rounded-xl font-semibold text-sm tracking-wide
          bg-gradient-to-r from-emerald-500 to-teal-600 text-white
          shadow-lg shadow-emerald-500/30
          hover:from-emerald-400 hover:to-teal-500 hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
          transition-all duration-200 ease-out
          ${className}
        `}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Redirecting to Checkout…</span>
          </>
        ) : (
          <>
            <LockIcon />
            <span>{label}</span>
            {price && quantity && (
              <span className="ml-1 opacity-75 font-normal">
                · ${(price * quantity).toFixed(2)}
              </span>
            )}
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <span>⚠</span> {error}
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