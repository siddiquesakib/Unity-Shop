// app/checkout/page.jsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiChevronLeft,
  FiAlertCircle,
  FiPackage,
  FiInfo,
  FiShield,
  FiLock,
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react'; // ← swap with your own auth hook if different
import PaymentButton from '@/components/common/payment-button/PaymentButton';

// ── Shop's receiving account — 
const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || 'shop@unityshop.com';
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || 'UnityShop';

export default function CheckoutPage() {
  const { checkoutGroups } = useCart();
  const router = useRouter();

  // Swap with your own auth if you don't use NextAuth
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';

  // If someone hits /checkout directly with nothing prepared, bounce them back
  useEffect(() => {
    if (checkoutGroups.length === 0) {
      router.replace('/cart');
    }
  }, [checkoutGroups, router]);

  if (checkoutGroups.length === 0) return null; // avoid flash before redirect

  // ── Compute grand total ───────────────────────────────────────────────────
  const grandTotal = checkoutGroups.reduce(
    (total, group) =>
      total + group.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0,
  );

  const totalQty = checkoutGroups.reduce(
    (total, group) => total + group.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const totalUniqueProducts = checkoutGroups.reduce(
    (n, g) => n + g.items.length,
    0,
  );

  // Product name string sent to Stripe (shows on checkout page + receipt)
  const productSummary = checkoutGroups
    .flatMap(g => g.items.map(i => `${i.name} (×${i.quantity})`))
    .join(', ');

  // All product IDs sent as metadata so backend can log them
  const allProductIds = checkoutGroups
    .flatMap(g => g.items.map(i => i.productId))
    .join(',');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition mb-4"
          >
            <FiChevronLeft className="mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Review your order, then complete payment in one click.
          </p>
        </div>

        {/* ── Breadcrumb steps ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <span className="text-orange-500 font-semibold">Cart</span>
          <span>›</span>
          <span className="text-gray-800 font-semibold">Checkout</span>
          <span>›</span>
          <span>Payment</span>
          <span>›</span>
          <span>Confirmation</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT: Order breakdown ──────────────────────────────────────── */}
          <div className="flex-1 space-y-4">
            {/* One visual card per seller group */}
            {checkoutGroups.map(group => {
              const groupSubtotal = group.items.reduce(
                (s, i) => s + i.price * i.quantity,
                0,
              );

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Seller header */}
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-orange-400" size={15} />
                      <span className="font-semibold text-gray-700 text-sm">
                        {group.seller.name}
                      </span>
                      {group.seller.verified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'item' : 'items'} ·{' '}
                      <span className="text-gray-600 font-medium">
                        ${groupSubtotal.toFixed(2)}
                      </span>
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        className="px-5 py-3 flex items-center gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiAlertCircle size={18} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          {item.variant && item.variant !== '—' && (
                            <p className="text-xs text-gray-400">
                              {item.variant}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${item.price.toFixed(2)}{' '}
                            <span className="text-gray-300">×</span>{' '}
                            {item.quantity}
                          </p>
                        </div>

                        {/* Line total */}
                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Info banner — payment goes to UnityShop */}
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <FiInfo
                className="text-blue-400 mt-0.5 flex-shrink-0"
                size={13}
              />
              <p>
                Your full payment is collected securely by{' '}
                <span className="font-semibold text-blue-600">{SHOP_NAME}</span>
                . Funds are distributed to each seller after order confirmation.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Summary + single PaymentButton ─────────────────────── */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              {/* Summary header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="px-6 py-4 space-y-2.5 text-sm">
                {/* Per-seller lines */}
                {checkoutGroups.map(group => {
                  const sub = group.items.reduce(
                    (s, i) => s + i.price * i.quantity,
                    0,
                  );
                  return (
                    <div
                      key={group.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-500 truncate max-w-[60%] flex items-center gap-1.5">
                        <FiPackage
                          size={11}
                          className="text-orange-400 flex-shrink-0"
                        />
                        {group.seller.name}
                      </span>
                      <span className="text-gray-700 font-medium">
                        ${sub.toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                {/* Divider + totals */}
                <div className="border-t border-gray-100 pt-2.5 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      Subtotal ({totalUniqueProducts}{' '}
                      {totalUniqueProducts === 1 ? 'product' : 'products'},{' '}
                      {totalQty} units)
                    </span>
                    <span className="text-gray-700">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Shipping</span>
                    <span className="italic">TBD at payment</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Tax</span>
                    <span className="italic">TBD at payment</span>
                  </div>
                </div>

                {/* Grand total highlight */}
                <div className="bg-gradient-to-r from-orange-50 to-transparent rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pay button */}
              <div className="px-6 pb-6 space-y-3">
                {!userEmail ? (
                  <div className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                    <FiAlertCircle size={13} className="flex-shrink-0" />
                    Please sign in to complete your purchase.
                  </div>
                ) : (
                  <PaymentButton
                    price={grandTotal}
                    productId={allProductIds}
                    quantity={1}
                    productName={productSummary}
                    userEmail={userEmail}
                    sellerName={SHOP_NAME}
                    sellerEmail={SHOP_EMAIL}
                    label="Complete Payment"
                    className="w-full justify-center text-base py-4"
                  />
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <FiLock size={11} />
                    Stripe Secured
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FiShield size={11} />
                    Buyer Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
