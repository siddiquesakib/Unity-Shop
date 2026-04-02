"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiCheck, FiPackage } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import PaymentButton from "@/components/common/payment-button/PaymentButton";
import PromoCodeInput from "@/components/promoCode/PromoCodeInput";

const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || "shop@unityshop.com";
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "UnityShop";

export default function CheckoutPage() {
  const { checkoutGroups, checkoutPromo } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [appliedPromo, setAppliedPromo] = useState(checkoutPromo || null);

  const flattenedItems = useMemo(
    () => (checkoutGroups || []).flatMap((group) => group.items || []),
    [checkoutGroups],
  );

  const totalQty = flattenedItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );

  useEffect(() => {
    if (!checkoutGroups || checkoutGroups.length === 0) {
      router.replace("/cart");
    }
  }, [checkoutGroups, router]);

  if (!checkoutGroups || checkoutGroups.length === 0) {
    return null;
  }

  const subtotal = flattenedItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const discountAmount = appliedPromo
    ? Math.min(Number(appliedPromo.discount || 0), subtotal)
    : 0;

  const totalWeight = flattenedItems.reduce(
    (w, item) => w + (Number(item.weight) || 0.5) * Number(item.quantity || 1),
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

  const productSummary = flattenedItems
    .map((item) => `${item.name} (x${item.quantity || 1})`)
    .join(", ");

  const allProductIds = flattenedItems
    .map((item) => item.productId)
    .filter(Boolean)
    .join(",");

  const sellerNames = [
    ...new Set(
      checkoutGroups
        .map((group) => group?.seller?.name)
        .filter((name) => typeof name === "string" && name.trim()),
    ),
  ];

  const sellerEmails = [
    ...new Set(
      checkoutGroups
        .map((group) => group?.seller?.email)
        .filter((email) => typeof email === "string" && email.trim()),
    ),
  ];

  const isNegotiatedCheckout = flattenedItems.some(
    (item) => item.pricingType === "negotiated",
  );

  return (
    <div className="min-h-screen bg-[#f7f6f3] pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review your order and complete payment.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black"
          >
            <FiChevronLeft size={14} /> Back to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiPackage size={16} className="text-gray-500" />
              <h2 className="text-sm font-bold text-gray-800">Items</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {flattenedItems.map((item) => {
                const qty = Number(item.quantity || 1);
                const unitPrice = Number(item.price || 0);
                const originalPrice = Number(item.originalPrice || unitPrice);
                const isNegotiated = item.pricingType === "negotiated";

                return (
                  <div key={item.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {qty}
                        </p>

                        {isNegotiated && (
                          <p className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                            <FiCheck size={12} /> Negotiated price applied
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-gray-900">
                          ${(unitPrice * qty).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${unitPrice.toFixed(2)} each
                        </p>
                        {isNegotiated && originalPrice > unitPrice && (
                          <p className="text-xs text-gray-400 line-through mt-0.5">
                            ${originalPrice.toFixed(2)} regular
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5">
            <PromoCodeInput
              subtotal={subtotal}
              onApply={setAppliedPromo}
              onRemove={() => setAppliedPromo(null)}
            />

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Customs</span>
                <span>${customsFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-700">
                  <span>
                    Discount
                    {appliedPromo?.code ? ` (${appliedPromo.code})` : ""}
                  </span>
                  <span>- ${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-base font-black text-gray-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {isNegotiatedCheckout && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 font-medium">
                You are checking out with an approved negotiated offer.
              </div>
            )}

            <PaymentButton
              price={grandTotal}
              productId={allProductIds}
              quantity={Math.max(1, totalQty)}
              productName={productSummary || "Checkout Items"}
              userEmail={userEmail}
              sellerName={sellerNames.join(", ") || SHOP_NAME}
              sellerEmail={sellerEmails.join(",") || SHOP_EMAIL}
              items={flattenedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
                name: item.name,
              }))}
              breakdown={{
                subtotal,
                shipping: shippingCost,
                customs: customsFee,
                platform: platformFee,
              }}
              label="Pay Securely"
              disabled={!userEmail || grandTotal <= 0}
            />

            {!userEmail && (
              <p className="text-xs text-red-500">
                Please sign in to continue with payment.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
