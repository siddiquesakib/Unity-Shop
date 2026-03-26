// app/cart/page.jsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiTrash2,
  FiShoppingCart,
  FiArrowRight,
  FiPackage,
  FiMinus,
  FiPlus,
  FiShield,
  FiTruck,
  FiLock,
  FiBookmark,
  FiCheck,
  FiRefreshCw,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSession } from 'next-auth/react';
import PromoCodeInput from '@/components/promoCode/PromoCodeInput';
import PaymentButton from '@/components/common/payment-button/PaymentButton';
import FreeShippingProgress from '@/components/common/FreeShippingProgress';
import Button from '@/components/common/Button';

const FREE_SHIP = 999;
const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || 'shop@unityshop.com';
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || 'UnityShop';

/** Returns base API URL with no trailing slash, or null if env var is missing. */
function getApiUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

const EMPTY_SHIPPING = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  note: '',
};

export default function CartPage() {
  const {
    cartGroups,
    savedItems,
    removeItem,
    updateQuantity,
    hydrated,
    moveToSaved,
    moveToCart,
    removeSavedItem,
  } = useCart();
  const { formatPrice } = useCurrency();
  const { data: session, status: sessionStatus } = useSession();
  const userEmail = session?.user?.email || '';

  const [removingId, setRemovingId] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [step, setStep] = useState('cart');
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [savedBadge, setSavedBadge] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [shippingMsg, setShippingMsg] = useState(null); // { type:'ok'|'err', text }

  /* ── Auto-load saved shipping info ─────────────────────────────── */
  useEffect(() => {
    if (sessionStatus === 'loading') return; // wait until session resolves
    if (!userEmail) return;

    const API_URL = getApiUrl();
    if (!API_URL) {
      console.warn(
        '[Cart] NEXT_PUBLIC_API_URL is not set — cannot load shipping info.',
      );
      return;
    }

    const url = `${API_URL}/users/shipping/${encodeURIComponent(userEmail)}`;
    console.log('[Cart] Loading shipping info →', url);

    fetch(url)
      .then(res => {
        console.log('[Cart] GET shipping status:', res.status);
        return res.ok ? res.json() : null;
      })
      .then(data => {
        console.log('[Cart] Shipping data:', data);
        if (data && data.fullName) {
          setShipping({
            fullName: data.fullName || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            zip: data.zip || '',
            note: data.note || '',
          });
          setSavedBadge(true);
        }
      })
      .catch(err => console.error('[Cart] Failed to load shipping info:', err));
  }, [userEmail, sessionStatus]);

  /* ── Derived totals ─────────────────────────────────────────────── */
  const allItems = useMemo(
    () =>
      cartGroups.flatMap(g =>
        g.items.map(i => ({
          ...i,
          sellerName: g.seller.name,
          sellerId: g.seller.id,
        })),
      ),
    [cartGroups],
  );
  const totalItems = allItems.length;
  const subtotal = allItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = allItems.reduce((s, i) => s + i.quantity, 0);
  const discountAmount = appliedPromo
    ? Math.min(appliedPromo.discount, subtotal)
    : 0;
  const shippingCost =
    subtotal >= FREE_SHIP ? 0 : shippingMethod === 'express' ? 120 : 60;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const totalSavings = discountAmount + (subtotal >= FREE_SHIP ? 60 : 0);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleQtyChange = (item, d) =>
    updateQuantity(item.id, item.quantity + d * (item.moq || 1));

  const handleRemove = id => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 250);
  };

  const handleShippingChange = e => {
    const { name, value } = e.target;
    setShipping(p => ({ ...p, [name]: value }));
    setShippingMsg(null);
  };

  const shippingValid =
    shipping.fullName.trim() &&
    shipping.phone.trim() &&
    shipping.address.trim() &&
    shipping.city.trim();

  /* ── Save to DB then advance to payment ─────────────────────────── */
  const handleContinueToPayment = useCallback(async () => {
    if (!shippingValid) return;

    const API_URL = getApiUrl();

    if (!API_URL) {
      console.warn('[Cart] Skipping save — NEXT_PUBLIC_API_URL not set.');
      setStep('payment');
      return;
    }
    if (!userEmail) {
      console.warn('[Cart] Skipping save — user not logged in.');
      setStep('payment');
      return;
    }

    setSavingShipping(true);
    setShippingMsg(null);

    const url = `${API_URL}/users/shipping/${encodeURIComponent(userEmail)}`;
    console.log('[Cart] Saving shipping info →', url, shipping);

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipping),
      });
      const data = await res.json();
      console.log('[Cart] PATCH shipping response:', res.status, data);

      if (res.ok) {
        setSavedBadge(true);
        setShippingMsg({ type: 'ok', text: 'Address saved to your profile ✓' });
        setTimeout(() => setStep('payment'), 600);
      } else {
        setShippingMsg({
          type: 'err',
          text:
            data?.message || 'Address could not be saved — proceeding anyway.',
        });
        setTimeout(() => setStep('payment'), 1400);
      }
    } catch (err) {
      console.error('[Cart] Network error saving shipping:', err);
      setShippingMsg({
        type: 'err',
        text: 'Network error — address not saved, but you can still proceed.',
      });
      setTimeout(() => setStep('payment'), 1400);
    } finally {
      setSavingShipping(false);
    }
  }, [shippingValid, userEmail, shipping]);

  const productSummary = allItems
    .map(i => `${i.name} (×${i.quantity})`)
    .join(', ');
  const allProductIds = allItems.map(i => i.productId).join(',');

  /* ── Loading ────────────────────────────────────────────────────── */
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-gray-200 border-t-black animate-spin" />
          <p className="text-gray-400 text-[16px]">Loading cart…</p>
        </div>
      </div>
    );
  }

  /* ── Empty states ───────────────────────────────────────────────── */
  if (totalItems === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] pt-20">
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center">
            <FiShoppingCart className="w-9 h-9 text-gray-300" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-[16px] mb-6">
            Browse our products and add items you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 bg-black text-white font-bold text-[16px] rounded-full hover:bg-gray-800 active:scale-95 transition-all"
          >
            Browse Products <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (totalItems === 0 && savedItems.length > 0) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 pt-5">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <FiShoppingCart className="w-7 h-7 text-gray-300" />
            </div>
            <h1 className="text-xl font-black text-gray-900 mb-1">
              Your Cart is Empty
            </h1>
            <p className="text-[16px] text-gray-500">
              But you have saved items! Move them to cart to checkout.
            </p>
          </div>
          <SavedForLater
            items={savedItems}
            moveToCart={moveToCart}
            removeSavedItem={removeSavedItem}
            formatPrice={formatPrice}
          />
          <div className="text-center mt-5">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[16px] font-bold text-gray-500 hover:text-black transition-colors"
            >
              <FiArrowRight className="rotate-180" size={12} /> Continue
              Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main layout ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f7f6f3] pt-20 pb-28 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-5">
        {/* Header + Steps */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pt-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {step === 'cart'
                ? 'Shopping Cart'
                : step === 'shipping'
                  ? 'Shipping Details'
                  : 'Payment'}
            </h1>
            <p className="text-[16px] text-gray-400 mt-0.5">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} · {totalQty}{' '}
              units
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {['Cart', 'Shipping', 'Payment'].map((s, i) => {
              const active =
                (i === 0 && step === 'cart') ||
                (i === 1 && step === 'shipping') ||
                (i === 2 && step === 'payment');
              const done =
                (i === 0 && step !== 'cart') || (i === 1 && step === 'payment');
              return (
                <div key={s} className="flex items-center gap-1.5">
                  {i > 0 && <div className="w-5 h-px bg-gray-300" />}
                  <button
                    onClick={() => {
                      if (done || active) {
                        if (i === 0) setStep('cart');
                        else if (i === 1 && step === 'payment')
                          setStep('shipping');
                      }
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] transition-all ${done ? 'bg-black text-white cursor-pointer' : active ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}
                  >
                    {done ? <FiCheck size={10} /> : i + 1}
                  </button>
                  <span
                    className={`hidden sm:inline ${active || done ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <FreeShippingProgress
          subtotal={subtotal}
          threshold={FREE_SHIP}
          formatPrice={formatPrice}
        />

        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT */}
          <div className="flex-1 space-y-3 min-w-0">
            {/* STEP: CART */}
            {step === 'cart' && (
              <>
                {cartGroups.map(group => (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                      <FiPackage size={12} className="text-gray-400" />
                      <span className="text-[16px] font-bold text-gray-700">
                        {group.seller.name}
                      </span>
                      {group.seller.verified && (
                        <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-full font-bold">
                          Verified
                        </span>
                      )}
                      <span className="ml-auto text-[10px] text-gray-400">
                        {group.items.length} items
                      </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {group.items.map(item => {
                        const isRemoving = removingId === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`flex gap-3 p-3 sm:p-4 transition-all duration-250 ${isRemoving ? 'opacity-0 -translate-x-4 max-h-0 py-0 overflow-hidden' : ''}`}
                          >
                            <Link
                              href={`/products/${item.productId}`}
                              className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-lg overflow-hidden bg-gray-50 shrink-0 group"
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="88px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                  <FiPackage size={24} />
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <Link
                                  href={`/products/${item.productId}`}
                                  className="text-[16px] sm:text-base font-semibold text-gray-900 hover:text-black line-clamp-1 leading-snug"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {item.variant && item.variant !== '—' && (
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                      {item.variant}
                                    </span>
                                  )}
                                  {item.selectedColor && (
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded capitalize">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                  {item.selectedSize && (
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase">
                                      {item.selectedSize}
                                    </span>
                                  )}
                                </div>
                                {item.stock > 0 && item.stock <= 5 && (
                                  <p className="text-[10px] text-gray-600 font-semibold mt-1 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-gray-600 animate-pulse" />{' '}
                                    Only {item.stock} left
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="inline-flex items-center rounded-full border border-gray-200">
                                  <button
                                    onClick={() => handleQtyChange(item, -1)}
                                    disabled={item.quantity <= (item.moq || 1)}
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 rounded-l-full hover:bg-gray-50"
                                  >
                                    <FiMinus size={11} />
                                  </button>
                                  <span className="w-8 text-center text-[16px] font-bold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQtyChange(item, 1)}
                                    disabled={
                                      item.quantity >= (item.maxQuantity || 999)
                                    }
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 rounded-r-full hover:bg-gray-50"
                                  >
                                    <FiPlus size={11} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => moveToSaved(item.id)}
                                  className="text-[10px] text-gray-400 hover:text-black flex items-center gap-0.5 transition-colors"
                                >
                                  <FiBookmark size={11} />{' '}
                                  <span className="hidden sm:inline">Save</span>
                                </button>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="text-[10px] text-gray-400 hover:text-gray-900 flex items-center gap-0.5 transition-colors"
                                >
                                  <FiTrash2 size={11} />{' '}
                                  <span className="hidden sm:inline">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </div>
                            <div className="text-right shrink-0 pl-2">
                              <p className="text-[16px] sm:text-base font-black text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-[10px] text-gray-400">
                                  {formatPrice(item.price)} ea
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-[16px] font-medium text-gray-400 hover:text-black transition-colors"
                >
                  <FiArrowRight className="rotate-180" size={12} /> Continue
                  Shopping
                </Link>
                {savedItems.length > 0 && (
                  <SavedForLater
                    items={savedItems}
                    moveToCart={moveToCart}
                    removeSavedItem={removeSavedItem}
                    formatPrice={formatPrice}
                  />
                )}
              </>
            )}

            {/* STEP: SHIPPING */}
            {step === 'shipping' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] sm:text-base font-black text-gray-900 flex items-center gap-1.5">
                    <FiTruck size={14} /> Shipping Information
                  </h2>
                  {savedBadge && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-black bg-gray-100 px-2 py-1 rounded-full">
                      <FiCheckCircle size={10} /> Saved address loaded
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name *"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleShippingChange}
                  />
                  <Input
                    label="Phone *"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    type="tel"
                  />
                </div>
                <Input
                  label="Address *"
                  name="address"
                  value={shipping.address}
                  onChange={handleShippingChange}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="City *"
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                  />
                  <Input
                    label="ZIP Code"
                    name="zip"
                    value={shipping.zip}
                    onChange={handleShippingChange}
                  />
                </div>
                <Input
                  label="Order Note (optional)"
                  name="note"
                  value={shipping.note}
                  onChange={handleShippingChange}
                />

                {/* Shipping method */}
                <div>
                  <p className="text-[16px] font-bold text-gray-500 mb-2">
                    Shipping Method
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'standard',
                        label: 'Standard',
                        time: '5-7 days',
                        cost: subtotal >= FREE_SHIP ? 0 : 60,
                      },
                      {
                        id: 'express',
                        label: 'Express',
                        time: '2-3 days',
                        cost: subtotal >= FREE_SHIP ? 0 : 120,
                      },
                    ].map(m => (
                      <label
                        key={m.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${shippingMethod === m.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={m.id}
                          checked={shippingMethod === m.id}
                          onChange={() => setShippingMethod(m.id)}
                          className="accent-black"
                        />
                        <div className="flex-1">
                          <span className="text-[16px] font-bold">
                            {m.label}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-2">
                            {m.time}
                          </span>
                        </div>
                        <span className="text-[16px] font-bold">
                          {m.cost === 0 ? (
                            <span className="text-black">FREE</span>
                          ) : (
                            formatPrice(m.cost)
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Feedback banner */}
                {shippingMsg && (
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg ${shippingMsg.type === 'ok' ? 'bg-gray-50 text-black' : 'bg-red-50 text-red-600'}`}
                  >
                    {shippingMsg.type === 'ok' ? (
                      <FiCheckCircle size={12} />
                    ) : (
                      <FiAlertCircle size={12} />
                    )}
                    {shippingMsg.text}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep('cart')}
                    className="px-5 h-10 border border-gray-200 rounded-full text-[16px] font-bold hover:border-black transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    disabled={!shippingValid || savingShipping}
                    className="flex-1 h-10 bg-black text-white rounded-full text-[16px] font-bold hover:bg-gray-800 disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {savingShipping ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{' '}
                        Saving…
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP: PAYMENT */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">
                <h2 className="text-[16px] sm:text-base font-black text-gray-900 flex items-center gap-1.5">
                  <FiCreditCard size={14} /> Payment
                </h2>
                <div className="bg-gray-50 rounded-lg p-3 text-[16px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ship to</span>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-black font-bold text-[10px]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold">
                    {shipping.fullName} · {shipping.phone}
                  </p>
                  <p className="text-gray-500">
                    {shipping.address}, {shipping.city} {shipping.zip}
                  </p>
                </div>
                <div className="space-y-2">
                  {allItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <FiPackage size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ×{item.quantity}
                        </p>
                      </div>
                      <span className="text-[16px] font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-gray-500 mb-2">
                    Pay with
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        name: 'bKash',
                        bg: 'bg-gray-50 border-gray-200',
                        text: 'text-black',
                      },
                      {
                        name: 'Nagad',
                        bg: 'bg-gray-50 border-orange-200',
                        text: 'text-black',
                      },
                      {
                        name: 'Visa/Card',
                        bg: 'bg-gray-50 border-gray-200',
                        text: 'text-black',
                      },
                      {
                        name: 'Cash on Delivery',
                        bg: 'bg-gray-50 border-gray-200',
                        text: 'text-gray-600',
                      },
                    ].map(p => (
                      <span
                        key={p.name}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${p.bg} ${p.text}`}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep('shipping')}
                    className="px-5 h-10 border border-gray-200 rounded-full text-[16px] font-bold hover:border-black transition-colors"
                  >
                    ← Back
                  </button>
                  {userEmail ? (
                    <div className="flex-1">
                      <PaymentButton
                        price={grandTotal}
                        productId={allProductIds}
                        quantity={1}
                        productName={productSummary}
                        userEmail={userEmail}
                        sellerName={SHOP_NAME}
                        sellerEmail={SHOP_EMAIL}
                        label={`Pay ${formatPrice(grandTotal)}`}
                        className="w-full justify-center text-[16px] sm:text-base py-3 font-bold rounded-full"
                      />
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="flex-1 h-10 bg-black text-white rounded-full text-[16px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      Sign in to Pay
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:w-80 xl:w-[340px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-24 overflow-hidden">
              <div className="p-4 sm:p-5">
                <h2 className="text-[16px] sm:text-base font-black text-gray-900 mb-3">
                  Order Summary
                </h2>
                <div className="space-y-2 text-[16px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span
                      className={`font-semibold ${shippingCost === 0 ? 'text-green-500' : ''}`}
                    >
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {appliedPromo && discountAmount > 0 && (
                    <div className="flex justify-between text-black font-medium">
                      <span>Promo ({appliedPromo.code})</span>
                      <span className="text-red-500">
                        −{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-black font-medium">
                      <span>Total Savings</span>
                      <span className="text-red-500">
                        −{formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[16px] sm:text-base font-bold">
                    Total
                  </span>
                  <span className="text-xl font-black">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                {step === 'cart' && (
                  <Button
                    showIcon={false}
                    onClick={() => totalItems > 0 && setStep('shipping')}
                    disabled={totalItems === 0}
                    className="w-full mt-5"
                  >
                    Secure Checkout ·{' '}
                    {formatPrice(grandTotal)}
                  </Button>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <PromoCodeInput
                    subtotal={subtotal}
                    onApply={promo => setAppliedPromo(promo)}
                    onRemove={() => setAppliedPromo(null)}
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-bold">
                  <span className="flex items-center gap-1">
                    <FiShield size={11} /> Buyer Protection
                  </span>
                  <span className="flex items-center gap-1">
                    <FiRefreshCw size={11} /> Easy Returns
                  </span>
                  <span className="flex items-center gap-1">
                    <FiLock size={11} /> SSL Secure
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[
                    {
                      name: 'bKash',
                      color: 'bg-gray-200 border border-gray-400 text-black',
                    },
                    { name: 'Nagad', color: 'bg-gray-200 text-black' },
                    { name: 'Visa', color: 'bg-gray-200 text-black' },
                    { name: 'COD', color: 'bg-gray-100 text-gray-600' },
                  ].map(p => (
                    <span
                      key={p.name}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.color}`}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-50 lg:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <span className="text-lg font-black">
              {formatPrice(grandTotal)}
            </span>
            {totalSavings > 0 && (
              <p className="text-[9px] text-black font-bold">
                Saving {formatPrice(totalSavings)}
              </p>
            )}
          </div>
          {step === 'cart' ? (
            <button
              onClick={() => totalItems > 0 && setStep('shipping')}
              disabled={totalItems === 0}
              className="flex-1 h-10 bg-black text-white font-bold text-[16px] uppercase tracking-wide rounded-full flex items-center justify-center gap-1.5 disabled:opacity-40 active:scale-95 transition-all"
            >
              <FiLock size={12} /> Checkout
            </button>
          ) : step === 'shipping' ? (
            <button
              onClick={handleContinueToPayment}
              disabled={!shippingValid || savingShipping}
              className="flex-1 h-10 bg-black text-white font-bold text-[16px] uppercase tracking-wide rounded-full flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
            >
              {savingShipping ? '…' : 'Continue →'}
            </button>
          ) : userEmail ? (
            <div className="flex-1">
              <PaymentButton
                price={grandTotal}
                productId={allProductIds}
                quantity={1}
                productName={productSummary}
                userEmail={userEmail}
                sellerName={SHOP_NAME}
                sellerEmail={SHOP_EMAIL}
                label="Pay Now"
                className="w-full justify-center text-[16px] py-2.5 font-bold rounded-full"
              />
            </div>
          ) : (
            <Link
              href="/login"
              className="flex-1 h-10 bg-black text-white font-bold text-[16px] uppercase rounded-full flex items-center justify-center"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Saved For Later ─────────────────────────────────────── */
function SavedForLater({ items, moveToCart, removeSavedItem, formatPrice }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <h2 className="text-[16px] sm:text-base font-black text-gray-900 mb-2 flex items-center gap-1.5">
        <FiBookmark size={14} /> Saved For Later{' '}
        <span className="text-gray-400 font-medium">({items.length})</span>
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {items.map(item => (
          <div key={item.id} className="flex gap-3 p-3">
            <Link
              href={`/products/${item.productId}`}
              className="relative w-16 h-16 rounded-lg bg-gray-50 overflow-hidden shrink-0"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <FiPackage size={18} />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.productId}`}
                className="text-[16px] font-semibold text-gray-900 line-clamp-1"
              >
                {item.name}
              </Link>
              <p className="text-[16px] font-black mt-0.5">
                {formatPrice(item.price)}
              </p>
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => moveToCart(item.id)}
                  className="text-[10px] font-bold text-black hover:underline flex items-center gap-0.5"
                >
                  <FiShoppingCart size={10} /> Move to Cart
                </button>
                <button
                  onClick={() => removeSavedItem(item.id)}
                  className="text-[10px] text-gray-400 hover:text-gray-900 flex items-center gap-0.5"
                >
                  <FiTrash2 size={10} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Input ───────────────────────────────────────────────── */
function Input({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-9 px-3 text-[16px] sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors bg-gray-50/50"
      />
    </div>
  );
}
