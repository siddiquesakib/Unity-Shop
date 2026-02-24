// app/checkout/page.jsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react'; // ← swap for your auth hook if different
import PaymentButton from '@/components/common/payment-button/PaymentButton';

export default function CheckoutPage() {
  const { checkoutGroups } = useCart();
  const router = useRouter();

  // ── Get the logged-in user's email ──────────────────────────────────────────
  // If you use a different auth system (e.g. a custom useAuth hook), swap this line.
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';

  // If someone navigates directly to /checkout with nothing to pay, send them back
  useEffect(() => {
    if (checkoutGroups.length === 0) {
      router.replace('/cart');
    }
  }, [checkoutGroups, router]);

  if (checkoutGroups.length === 0) return null; // avoid flash before redirect

  // ── Totals ───────────────────────────────────────────────────────────────────
  const grandTotal = checkoutGroups.reduce(
    (total, group) =>
      total +
      group.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    0,
  );

  const totalQty = checkoutGroups.reduce(
    (total, group) =>
      total + group.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            Review your order and complete payment below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Order details ─────────────────────────────────────────── */}
          <div className="flex-1 space-y-6">
            {/* One card per seller */}
            {checkoutGroups.map(group => {
              const groupTotal = group.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              );

              // Build a readable product name for Stripe
              // e.g.  "Headphones (×100), Speaker (×50)"
              const productSummary = group.items
                .map(i => `${i.name} (×${i.quantity})`)
                .join(', ');

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Seller header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-orange-500" />
                      <span className="font-semibold text-gray-800">
                        {group.seller.name}
                      </span>
                      {group.seller.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiAlertCircle size={20} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          {item.variant && item.variant !== '—' && (
                            <p className="text-xs text-gray-400">
                              {item.variant}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>

                        {/* Line total */}
                        <p className="font-semibold text-gray-800 whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Seller subtotal + Pay button */}
                  <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Seller subtotal
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        ${groupTotal.toFixed(2)}
                      </p>
                    </div>

                    {/* ── PaymentButton ── */}
                    {!userEmail ? (
                      <div className="text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={13} />
                        Sign in to pay
                      </div>
                    ) : (
                      <PaymentButton
                        price={groupTotal}
                        productId={group.items.map(i => i.productId).join(',')}
                        quantity={1}
                        productName={productSummary}
                        userEmail={userEmail}
                        sellerName={group.seller.name}
                        sellerEmail={group.seller.email || ''}
                        label={`Pay ${group.seller.name}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Grand total summary ──────────────────────────────────── */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Total
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({totalQty})</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-400 italic">TBD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-400 italic">TBD</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Multi-seller note */}
              {checkoutGroups.length > 1 && (
                <p className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  Your order has{' '}
                  <span className="font-medium text-gray-600">
                    {checkoutGroups.length} sellers
                  </span>
                  . Each seller is paid separately — click the payment button
                  inside each seller's card above.
                </p>
              )}

              <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
                <p>🔒 Secured by Stripe</p>
                <p>✓ Buyer Protection Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
