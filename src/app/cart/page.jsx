// app/cart/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiTrash2,
  FiShoppingCart,
  FiArrowRight,
  FiPackage,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShield,
  FiTruck,
  FiLock,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
  FiChevronRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import PromoCodeInput from '@/components/promoCode/PromoCodeInput';
// import PromoCodeInput from '@/components/cart/PromoCodeInput';

export default function CartPage() {
  const { cartGroups, removeItem, updateQuantity, prepareCheckout, hydrated } =
    useCart();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const allItemIds = cartGroups.flatMap((g) => g.items.map((i) => i.id));

  // ── Promo state ────────────────────────────────────────────────────────────
  const [appliedPromo, setAppliedPromo] = useState(null);
  // appliedPromo shape: { code, discount, description } | null

  // ─── Selection helpers ────────────────────────────────────────────────────
  const allItemIds = cartGroups.flatMap(g => g.items.map(i => i.id));

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const map = {};
    allItemIds.forEach((id) => (map[id] = next));
    setSelectedItems(map);
  };

  const toggleSellerGroup = (sellerId) => {
    const group = cartGroups.find((g) => g.seller.id === sellerId);
    if (!group) return;
    const allSelected = group.items.every((i) => selectedItems[i.id]);
    const map = { ...selectedItems };
    group.items.forEach((i) => (map[i.id] = !allSelected));
    setSelectedItems(map);
    setSelectAll(allItemIds.every((id) => map[id]));
  };

  const toggleItem = (itemId) => {
    const map = { ...selectedItems, [itemId]: !selectedItems[itemId] };
    setSelectedItems(map);
    setSelectAll(allItemIds.every((id) => map[id]));
  };

  const selectedCount = allItemIds.filter((id) => selectedItems[id]).length;

  const subtotal = cartGroups.reduce(
    (total, group) =>
      total +
      group.items.reduce(
        (sum, item) =>
          selectedItems[item.id] ? sum + item.price * item.quantity : sum,
        0,
      ),
    0,
  );

  // Discount only applies against the selected subtotal
  const discountAmount = appliedPromo
    ? Math.min(appliedPromo.discount, subtotal) // never discount more than subtotal
    : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const selectedQtyTotal = cartGroups.reduce(
    (total, group) =>
      total +
      group.items.reduce(
        (sum, item) => (selectedItems[item.id] ? sum + item.quantity : sum),
        0,
      ),
    0,
  );

  // ─── Quantity helpers ─────────────────────────────────────────────────────
  const handleQtyChange = (item, delta) => {
    updateQuantity(item.id, item.quantity + delta * item.moq);
  };
  const handleQtyInput = (item, raw) => {
    const val = parseInt(raw, 10);
    if (!isNaN(val)) updateQuantity(item.id, val);
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 300);
  };

  // ─── Proceed to Checkout ──────────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    const selectedGroups = cartGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => selectedItems[item.id]),
      }))
      .filter((group) => group.items.length > 0);
    prepareCheckout(selectedGroups);
    router.push("/checkout");
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-gray-200 border-t-black animate-spin" />
          <p className="text-gray-500 text-sm">Loading your cart…</p>
        </div>
      </div>
    );
  }

  /* ── Empty ───────────────────────────────────────────────────────── */
  if (cartGroups.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <FiShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8">
            Browse our products and add items you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Browse Products
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Total items ─────────────────────────────────────────────────── */
  const totalItems = cartGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Cart items ───────────────────────────────────────── */}
          <div className="flex-1 space-y-4">
            {/* Select all */}
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4.5 h-4.5 accent-black rounded cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Select All ({allItemIds.length})
                </span>
              </label>
              {selectedCount > 0 && (
                <span className="text-sm text-gray-500 font-medium">
                  {selectedCount} selected
                </span>
              )}
            </div>

            {/* Seller groups */}
            {cartGroups.map((sellerGroup) => {
              const groupSelected = sellerGroup.items.every(
                (i) => !!selectedItems[i.id],
              );
              return (
                <div
                  key={sellerGroup.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Seller header */}
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={groupSelected}
                      onChange={() => toggleSellerGroup(sellerGroup.seller.id)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                    <FiPackage className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-800">
                      {sellerGroup.seller.name}
                    </span>
                    {sellerGroup.seller.verified && (
                      <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {sellerGroup.items.map((item) => {
                      const isSelected = !!selectedItems[item.id];
                      const isRemoving = removingId === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`flex gap-4 p-5 transition-all duration-300 ${
                            isRemoving
                              ? "opacity-0 -translate-x-4 max-h-0 py-0! overflow-hidden"
                              : ""
                          } ${isSelected ? "bg-gray-50/80" : ""}`}
                        >
                          {/* Checkbox */}
                          <div className="pt-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItem(item.id)}
                              className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                          </div>

                          {/* Image */}
                          <Link
                            href={`/products/${item.productId}`}
                            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 group"
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FiPackage size={28} />
                              </div>
                            )}
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                              {/* Name & meta */}
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/products/${item.productId}`}
                                  className="text-sm sm:text-base font-semibold text-gray-900 hover:text-black line-clamp-2 leading-snug transition-colors"
                                >
                                  {item.name}
                                </Link>
                                {item.variant && item.variant !== "—" && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {item.variant}
                                  </p>
                                )}
                                {item.stock <= 10 && item.stock > 0 && (
                                  <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Only {item.stock} left in stock
                                  </p>
                                )}
                              </div>

                              {/* Price */}
                              <div className="sm:text-right shrink-0 sm:pl-6">
                                <p className="text-lg sm:text-xl font-black text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    ${item.price.toFixed(2)} each
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Qty + Remove */}
                            <div className="flex items-center gap-4 mt-4">
                              <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
                                <button
                                  onClick={() => handleQtyChange(item, -1)}
                                  disabled={item.quantity <= item.moq}
                                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-30 transition-colors rounded-l-full hover:bg-gray-50"
                                >
                                  <FiMinus size={14} />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQtyInput(item, e.target.value)
                                  }
                                  className="w-10 h-9 text-center text-sm font-bold border-x border-gray-200 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  min={item.moq}
                                  max={item.maxQuantity}
                                  step={item.moq}
                                />
                                <button
                                  onClick={() => handleQtyChange(item, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-30 transition-colors rounded-r-full hover:bg-gray-50"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemove(item.id)}
                                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove"
                              >
                                <FiTrash2 size={15} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mt-2"
            >
              <FiArrowRight className="rotate-180 w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* ── Right: Order summary ───────────────────────────────────── */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 sticky top-28 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal ({selectedCount}{" "}
                      {selectedCount === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Promo discount</span>
                      <span>−$0.00</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mt-5 pt-5 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedCount === 0}
                  className={`w-full mt-5 py-3.5 text-sm font-bold rounded-full transition-all duration-200 ${
                    selectedCount > 0
                      ? "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 hover:scale-[1.01] active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedCount > 0
                    ? `Checkout · $${subtotal.toFixed(2)}`
                    : "Select items to checkout"}
                </button>

                {/* Promo */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Promo Code
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-l-xl text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (promoCode.trim()) setPromoApplied(true);
                      }}
                      className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-r-xl hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1.5 font-medium">
                      <FiCheck size={14} /> Code applied!
                    </p>
                  )}
                </div>
              </div>

              {/* Trust strip */}
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FiLock size={13} /> Secure
                </span>
                <span className="flex items-center gap-1.5">
                  <FiShield size={13} /> Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <FiTruck size={13} /> Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
