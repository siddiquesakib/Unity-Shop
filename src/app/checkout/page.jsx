"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiLock, FiPackage, FiTruck } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import PaymentButton from "@/components/common/payment-button/PaymentButton";
import PromoCodeInput from "@/components/promoCode/PromoCodeInput";

const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || "shop@unityshop.com";
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "UnityShop";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const DEFAULT_SHIPPING = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  country: "Bangladesh",
  zip: "",
  note: "",
};

export default function CheckoutPage() {
  const { checkoutGroups, checkoutPromo } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userId = session?.user?._id || null;

  const [shipping, setShipping] = useState(DEFAULT_SHIPPING);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingOptions, setShippingOptions] = useState(null);
  const [shippingOptionsError, setShippingOptionsError] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(checkoutPromo || null);

  useEffect(() => {
    if (!API_BASE || !userEmail) return;

    const token = getAuthToken();
    if (!token) return;

    const fetchDefaults = async () => {
      try {
        const shippingRes = await fetch(
          `${API_BASE}/users/shipping/${encodeURIComponent(userEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (shippingRes.ok) {
          const shippingData = await shippingRes.json();
          if (shippingData?.fullName) {
            setShipping(prev => ({
              ...prev,
              fullName: shippingData.fullName || "",
              phone: shippingData.phone || "",
              address: shippingData.address || "",
              city: shippingData.city || prev.city,
              country: shippingData.country || prev.country,
              zip: shippingData.zip || "",
              note: shippingData.note || "",
            }));
            return;
          }
        }

        const locationRes = await fetch(`${API_BASE}/users/location/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!locationRes.ok) return;
        const locationData = await locationRes.json();

        if (locationData?.activeLocation?.country || locationData?.activeLocation?.city) {
          setShipping(prev => ({
            ...prev,
            country: prev.country || locationData.activeLocation.country || "Bangladesh",
            city: prev.city || locationData.activeLocation.city || "",
          }));
        }
      } catch (error) {
        console.error("[Checkout] Failed to load location defaults:", error);
      }
    };

    fetchDefaults();
  }, [userEmail]);

  useEffect(() => {
    if (!checkoutGroups.length) {
      router.replace("/cart");
    }
  }, [checkoutGroups.length, router]);

  const allItems = useMemo(
    () => checkoutGroups.flatMap((group) => group.items || []),
    [checkoutGroups],
  );

  const subtotal = allItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const discountAmount = appliedPromo
    ? Math.min(Number(appliedPromo.discount || 0), subtotal)
    : 0;

  const productIdsArray = allItems.map((item) => item.productId).filter(Boolean);
  const allProductIds = productIdsArray.join(",");

  useEffect(() => {
    if (!API_BASE || !shipping.city || !shipping.country || !productIdsArray.length) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setShippingOptions(null);
      setShippingOptionsError("Please log in again to get shipping options");
      return;
    }

    setShippingLoading(true);
    setShippingOptionsError(null);

    fetch(`${API_BASE}/payment/shipping-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productIds: productIdsArray,
        shippingAddress: {
          city: shipping.city,
          country: shipping.country,
        },
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch shipping options");
        }
        return data;
      })
      .then((data) => {
        setShippingOptions(data);
        if (!data?.options?.[shippingMethod] && data?.recommended) {
          setShippingMethod(data.recommended);
        }
      })
      .catch((err) => {
        setShippingOptions(null);
        setShippingOptionsError(err.message || "Could not load shipping options");
      })
      .finally(() => setShippingLoading(false));
  }, [productIdsArray.join(","), shipping.city, shipping.country, shippingMethod]);

  if (!checkoutGroups.length) return null;

  const shippingCost = Number(shippingOptions?.options?.[shippingMethod]?.cost || 0);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const shippingValid =
    shipping.fullName.trim() &&
    shipping.phone.trim() &&
    shipping.address.trim() &&
    shipping.city.trim() &&
    shipping.country.trim();

  const productSummary = allItems
    .map((item) => `${item.name} (×${item.quantity})`)
    .join(", ");

  return (
    <div className="min-h-screen bg-[#f7f6f3] pt-20 pb-14">
      <div className="max-w-6xl mx-auto px-3 sm:px-5">
        <div className="mb-5">
          <Link href="/cart" className="text-sm text-gray-500 hover:text-black transition-colors">
            Back to Cart
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Checkout</h1>
          <p className="text-gray-500 text-sm">Cart checkout and buy-now both use this page and the same checkout state.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <FiTruck size={14} /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Full Name *" name="fullName" value={shipping.fullName} onChange={setShipping} />
                <Input label="Phone *" name="phone" value={shipping.phone} onChange={setShipping} />
              </div>
              <Input label="Address *" name="address" value={shipping.address} onChange={setShipping} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="City *" name="city" value={shipping.city} onChange={setShipping} />
                <Input label="Country *" name="country" value={shipping.country} onChange={setShipping} />
                <Input label="ZIP" name="zip" value={shipping.zip} onChange={setShipping} />
              </div>
              <Input label="Note" name="note" value={shipping.note} onChange={setShipping} />

              {shippingLoading && <p className="text-xs text-gray-500">Loading shipping options...</p>}
              {shippingOptionsError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {shippingOptionsError}
                </p>
              )}

              <div className="space-y-2">
                {(shippingOptions?.options
                  ? Object.entries(shippingOptions.options).map(([key, opt]) => ({
                      id: key,
                      label: key === "express" ? "Express" : "Standard",
                      cost: Number(opt.cost || 0),
                      eta: Number(opt.estimatedDays || 0),
                    }))
                  : [{ id: "standard", label: "Standard", cost: 0, eta: 0 }]
                ).map((option) => (
                  <label key={option.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${shippingMethod === option.id ? "border-black bg-gray-50" : "border-gray-200"}`}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={() => setShippingMethod(option.id)}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500">
                        {option.eta ? `${option.eta} day${option.eta > 1 ? "s" : ""}` : "Estimated at checkout"}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{option.cost ? formatPrice(option.cost) : "FREE"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 mb-3">
                <FiPackage size={14} /> Items ({allItems.length})
              </h2>
              <div className="space-y-3">
                {allItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FiPackage size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit sticky top-24">
            <h2 className="text-base font-black text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold">{shippingCost ? formatPrice(shippingCost) : "FREE"}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Promo ({appliedPromo.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-lg font-black text-gray-900">{formatPrice(grandTotal)}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <PromoCodeInput
                subtotal={subtotal}
                onApply={(promo) => setAppliedPromo(promo)}
                onRemove={() => setAppliedPromo(null)}
              />
            </div>

            <div className="mt-4">
              {userEmail ? (
                <PaymentButton
                  price={grandTotal}
                  productId={allProductIds}
                  quantity={1}
                  productName={productSummary}
                  userId={userId}
                  userEmail={userEmail}
                  sellerName={SHOP_NAME}
                  sellerEmail={SHOP_EMAIL}
                  shippingAddress={{ ...shipping, shippingMethod }}
                  phoneNumber={shipping.phone}
                  breakdown={{
                    subtotal,
                    shipping: shippingCost,
                    discount: discountAmount,
                    grandTotal,
                  }}
                  items={allItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    name: item.name,
                  }))}
                  disabled={!shippingValid || !allItems.length}
                  label={`Pay ${formatPrice(grandTotal)}`}
                  className="w-full justify-center"
                />
              ) : (
                <Link href="/login" className="w-full h-11 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center">
                  <FiLock size={13} className="mr-2" /> Sign in to Pay
                </Link>
              )}
              {!shippingValid && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Complete required shipping fields to continue.
                </p>
              )}
              {shippingValid && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <FiCheckCircle size={12} /> Ready for secure payment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:border-black"
      />
    </div>
  );
}
