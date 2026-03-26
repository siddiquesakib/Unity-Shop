'use client';

import { useEffect, useState } from 'react';
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
  FiCheck,
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import PaymentButton from '@/components/common/payment-button/PaymentButton';
import PromoCodeInput from '@/components/promoCode/PromoCodeInput';
import ShippingForm from '@/components/checkout/ShippingForm';

const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || 'shop@unityshop.com';
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || 'UnityShop';

export default function CheckoutPage() {
  const { checkoutGroups, checkoutPromo } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';
  const userId = session?.user?.id || '';

  // ── FIX 1: ALL hooks must come before any conditional return ──────────────
  // Previously these were AFTER the early return — that crashes React with
  // "Rendered more hooks than during the previous render"
  const [appliedPromo, setAppliedPromo] = useState(checkoutPromo || null);
  const [shippingInfo, setShippingInfo] = useState(null);

  useEffect(() => {
    if (checkoutGroups.length === 0) {
      router.replace('/cart');
    }
  }, [checkoutGroups, router]);

  // Safe to early-return now — all hooks are already declared above
  if (checkoutGroups.length === 0) return null;

  // ── Compute totals ─────────────────────────────────────────────────────────
  const subtotal = checkoutGroups.reduce(
    (total, group) =>
      total + group.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0,
  );

  const discountAmount = appliedPromo
    ? Math.min(appliedPromo.discount, subtotal)
    : 0;

  const totalWeight = checkoutGroups.reduce(
    (w, group) =>
      w +
      group.items.reduce(
        (wg, i) => wg + (Number(i.weight) || 0.5) * i.quantity,
        0,
      ),
    0,
  );

  const shippingCost =
    totalWeight > 0 ? 15 + Math.max(0, Math.ceil(totalWeight - 1)) * 10 : 0;

  const customsFee = subtotal * 0.15;
  const platformFee = subtotal * 0.05;

  const grandTotal = Math.max(
    0,
    subtotal - discountAmount + shippingCost + customsFee + platformFee,
  );

  const totalQty = checkoutGroups.reduce(
    (total, group) => total + group.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const totalUniqueProducts = checkoutGroups.reduce(
    (n, g) => n + g.items.length,
    0,
  );

  const productSummary = checkoutGroups
    .flatMap(g => g.items.map(i => `${i.name} (×${i.quantity})`))
    .join(', ');

  const allProductIds = checkoutGroups
    .flatMap(g => g.items.map(i => i.productId))
    .join(',');

  const steps = [
    { label: 'Cart', done: true },
    { label: 'Checkout', active: true },
    { label: 'Payment', done: false },
    { label: 'Confirmation', done: false },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      {/* Header */}
      <div className="bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-4 group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                  <FiChevronLeft className="w-4 h-4" />
                </div>
                Back to Cart
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                Checkout
              </h1>
              <p className="text-gray-500 mt-2 text-base max-w-lg">
                Review your order details and complete your purchase securely.
              </p>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  {i > 0 && <div className="w-8 h-px bg-gray-200 mx-3" />}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        step.done
                          ? 'bg-black text-white'
                          : step.active
                            ? 'bg-black text-white ring-4 ring-gray-100'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.done ? <FiCheck size={10} /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wide hidden sm:block ${
                        step.done || step.active
                          ? 'text-black'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── LEFT: Order breakdown & Shipping ─────────────────────────── */}
          <div className="flex-1 space-y-8">
            {/* Shipping section */}
            <div
              className={`p-6 bg-white rounded-2xl border transition-all ${
                shippingInfo
                  ? 'border-green-200 ring-1 ring-green-100'
                  : 'border-gray-200'
              }`}
            >
              {!shippingInfo ? (
                <ShippingForm onSubmit={setShippingInfo} />
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-black flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                        <FiCheck />
                      </span>
                      Shipping Address Confirmed
                    </h2>
                    <p className="font-semibold text-gray-900">
                      {shippingInfo.fullName}
                    </p>
                    <p className="text-gray-600">{shippingInfo.addressLine1}</p>
                    {shippingInfo.addressLine2 && (
                      <p className="text-gray-600">
                        {shippingInfo.addressLine2}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {shippingInfo.city}, {shippingInfo.state}{' '}
                      {shippingInfo.zipCode}
                    </p>
                    <p className="text-gray-600">{shippingInfo.country}</p>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                      📞 {shippingInfo.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setShippingInfo(null)}
                    className="text-sm font-bold text-gray-500 hover:text-black underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Items review */}
            <h2 className="text-xl font-black text-black px-1">Review Items</h2>
            <div className="space-y-4">
              {checkoutGroups.map(group => {
                const groupSubtotal = group.items.reduce(
                  (s, i) => s + i.price * i.quantity,
                  0,
                );
                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-black/10 transition-colors"
                  >
                    {/* Seller header */}
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-black">
                          <FiPackage size={14} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black text-sm">
                            {group.seller.name}
                          </span>
                          {group.seller.verified && (
                            <span className="inline-flex h-5 items-center gap-1 rounded-full bg-black px-2 text-[10px] font-medium text-white">
                              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
                        {group.items.length}{' '}
                        {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Items list */}
                    <div className="divide-y divide-gray-100">
                      {group.items.map(item => (
                        <div
                          key={item.id}
                          className="px-6 py-5 flex items-center gap-5 group"
                        >
                          <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-black/10 transition-colors">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiAlertCircle size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <h3 className="text-base font-bold text-black line-clamp-1 mb-1">
                              {item.name}
                            </h3>
                            {item.variant && item.variant !== '—' && (
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                {item.variant}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-semibold text-black">
                                ${Number(item.price).toFixed(2)}
                              </span>
                              <span className="text-gray-300">×</span>
                              <span>{item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-black">
                              $
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Seller subtotal */}
                    <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal for this seller
                      </span>
                      <span className="text-sm font-bold text-black">
                        ${groupSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Info banner */}
              <div className="flex items-start gap-4 text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-black">
                  <FiInfo size={14} />
                </div>
                <p className="pt-1 leading-relaxed">
                  Your full payment is collected securely by{' '}
                  <span className="font-bold text-black">{SHOP_NAME}</span>.
                  Funds are distributed to each seller automatically after order
                  confirmation.
                </p>
              </div>
            </div>
          </div>
          {/* ── FIX 3: This closing </div> was missing — left column now properly closed
               so the right column sits beside it, not inside it ── */}

          {/* ── RIGHT: Summary + PaymentButton ───────────────────────────── */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* Summary header */}
              <div className="px-8 pt-8 pb-6 bg-gray-50/50 border-b border-gray-100">
                <h2 className="text-xl font-black text-black tracking-tight">
                  Order Summary
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {totalUniqueProducts} products ready for checkout
                </div>
              </div>

              <div className="px-8 py-6 space-y-4">
                {/* Per-seller lines */}
                {checkoutGroups.map(group => {
                  const sub = group.items.reduce(
                    (s, i) => s + i.price * i.quantity,
                    0,
                  );
                  return (
                    <div
                      key={group.id}
                      className="flex justify-between items-center text-sm group"
                    >
                      <span className="text-gray-500 truncate max-w-[60%] flex items-center gap-2 group-hover:text-black transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-black transition-colors" />
                        {group.seller.name}
                      </span>
                      <span className="font-bold text-black">
                        ${sub.toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                <div className="border-t border-gray-100 pt-2.5 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      Subtotal ({totalUniqueProducts}{' '}
                      {totalUniqueProducts === 1 ? 'product' : 'products'},{' '}
                      {totalQty} units)
                    </span>
                    <span className="text-gray-700">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedPromo && discountAmount > 0 && (
                    <div className="flex justify-between items-start text-emerald-600 text-sm">
                      <span className="flex items-center gap-1">
                        🏷️{' '}
                        <span className="font-semibold">
                          {appliedPromo.code}
                        </span>
                        <span className="text-gray-400 text-xs font-normal">
                          ({appliedPromo.description})
                        </span>
                      </span>
                      <span className="font-semibold whitespace-nowrap">
                        −${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Shipping</span>
                    <span className="font-medium text-black bg-gray-100 px-2 py-0.5 rounded text-xs">
                      Calculated next
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Tax</span>
                    <span className="font-medium text-black bg-gray-100 px-2 py-0.5 rounded text-xs">
                      Calculated next
                    </span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="bg-black rounded-xl px-5 py-4 flex justify-between items-center shadow-lg shadow-black/5 mt-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total to Pay
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pay button section */}
              <div className="px-8 pb-8 space-y-4">
                <PromoCodeInput
                  subtotal={subtotal}
                  onApply={promo => setAppliedPromo(promo)}
                  onRemove={() => setAppliedPromo(null)}
                />

                {!userEmail ? (
                  <div className="text-xs font-medium text-red-500 bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3 border border-gray-100">
                    <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <p>
                      Please sign in to your account to complete this purchase
                      securely.
                    </p>
                  </div>
                ) : (
                  // ── FIX 2: Was two siblings in a ternary with no wrapper — invalid JSX.
                  // Wrapped in a fragment so both elements are valid children.
                  <>
                    <PaymentButton
                      price={grandTotal}
                      productId={allProductIds}
                      quantity={1}
                      productName={productSummary}
                      userEmail={userEmail}
                      userId={userId}
                      sellerName={SHOP_NAME}
                      sellerEmail={SHOP_EMAIL}
                      label={shippingInfo ? 'Pay Now' : 'Fill Shipping Info'}
                      className="w-full justify-center text-base py-4 font-bold rounded-xl"
                      disabled={!shippingInfo}
                      shippingAddress={shippingInfo}
                      phoneNumber={shippingInfo?.phone}
                    />
                    {!shippingInfo && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Complete the shipping details to proceed.
                      </p>
                    )}
                  </>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 py-2.5 rounded-lg border border-gray-100">
                    <FiLock size={12} className="text-black" />
                    SSL Secured
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 py-2.5 rounded-lg border border-gray-100">
                    <FiShield size={12} className="text-black" />
                    Buyer Protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
