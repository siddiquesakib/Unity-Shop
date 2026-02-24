// app/checkout/page.jsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiAlertCircle,
  FiPackage,
  FiInfo,
  FiShield,
  FiLock,
  FiCheck,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import PaymentButton from "@/components/common/payment-button/PaymentButton";

const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || "shop@unityshop.com";
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "UnityShop";

export default function CheckoutPage() {
  const { checkoutGroups } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (checkoutGroups.length === 0) {
      router.replace("/cart");
    }
  }, [checkoutGroups, router]);

  if (checkoutGroups.length === 0) return null;

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

  const productSummary = checkoutGroups
    .flatMap((g) => g.items.map((i) => `${i.name} (×${i.quantity})`))
    .join(", ");

  const allProductIds = checkoutGroups
    .flatMap((g) => g.items.map((i) => i.productId))
    .join(",");

  const steps = [
    { label: "Cart", done: true },
    { label: "Checkout", active: true },
    { label: "Payment", done: false },
    { label: "Confirmation", done: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mb-4"
          >
            <FiChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Checkout
          </h1>
          <div className="w-12 h-1 bg-black mt-3 rounded-full" />
          <p className="text-gray-400 mt-3 text-sm">
            Review your order, then complete payment in one click.
          </p>
        </div>

        {/* ── Breadcrumb stepper ───────────────────────────────────────── */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              {i > 0 && (
                <div
                  className={`w-8 sm:w-16 h-px ${step.done || step.active ? "bg-black" : "bg-gray-200"}`}
                />
              )}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.done
                      ? "bg-black text-white"
                      : step.active
                        ? "bg-black text-white ring-4 ring-gray-200"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.done ? <FiCheck className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    step.done || step.active ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT: Order breakdown ──────────────────────────────────── */}
          <div className="flex-1 space-y-4">
            {checkoutGroups.map((group) => {
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
                  <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-gray-400" size={14} />
                      <span className="font-semibold text-gray-800 text-sm">
                        {group.seller.name}
                      </span>
                      {group.seller.verified && (
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "item" : "items"} ·{" "}
                      <span className="text-gray-700 font-semibold">
                        ${groupSubtotal.toFixed(2)}
                      </span>
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
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

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {item.name}
                          </p>
                          {item.variant && item.variant !== "—" && (
                            <p className="text-xs text-gray-400">
                              {item.variant}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${item.price.toFixed(2)}{" "}
                            <span className="text-gray-300">×</span>{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-black whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Info banner */}
            <div className="flex items-start gap-3 text-xs text-gray-500 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
              <FiInfo
                className="text-gray-400 mt-0.5 flex-shrink-0"
                size={14}
              />
              <p>
                Your full payment is collected securely by{" "}
                <span className="font-bold text-black">{SHOP_NAME}</span>. Funds
                are distributed to each seller after order confirmation.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Summary + PaymentButton ────────────────────────── */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              {/* Summary header */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-lg font-bold text-black">Order Summary</h2>
                <div className="w-8 h-0.5 bg-black mt-2 rounded-full" />
              </div>

              <div className="px-6 py-4 space-y-2.5 text-sm">
                {/* Per-seller lines */}
                {checkoutGroups.map((group) => {
                  const sub = group.items.reduce(
                    (s, i) => s + i.price * i.quantity,
                    0,
                  );
                  return (
                    <div
                      key={group.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400 truncate max-w-[60%] flex items-center gap-1.5">
                        <FiPackage
                          size={11}
                          className="text-gray-400 flex-shrink-0"
                        />
                        {group.seller.name}
                      </span>
                      <span className="text-gray-700 font-semibold">
                        ${sub.toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                {/* Divider + totals */}
                <div className="border-t border-gray-100 pt-2.5 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>
                      Subtotal ({totalUniqueProducts}{" "}
                      {totalUniqueProducts === 1 ? "product" : "products"},{" "}
                      {totalQty} units)
                    </span>
                    <span className="text-gray-700 font-semibold">
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
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center mt-2">
                  <span className="font-bold text-black text-base">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-black">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pay button */}
              <div className="px-6 pb-6 space-y-3">
                {!userEmail ? (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2 border border-gray-100">
                    <FiAlertCircle
                      size={13}
                      className="flex-shrink-0 text-gray-400"
                    />
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
                  <span className="flex items-center gap-1.5">
                    <FiLock size={11} className="text-black" />
                    Stripe Secured
                  </span>
                  <span className="text-gray-200">·</span>
                  <span className="flex items-center gap-1.5">
                    <FiShield size={11} className="text-black" />
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
