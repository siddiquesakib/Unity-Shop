// app/cart/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiTrash2,
  FiShoppingCart,
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

  // ── Promo state ────────────────────────────────────────────────────────────
  const [appliedPromo, setAppliedPromo] = useState(null);
  // appliedPromo shape: { code, discount, description } | null

  // ─── Selection helpers ────────────────────────────────────────────────────
  const allItemIds = cartGroups.flatMap(g => g.items.map(i => i.id));

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const map = {};
    allItemIds.forEach(id => (map[id] = next));
    setSelectedItems(map);
  };

  const toggleSellerGroup = sellerId => {
    const group = cartGroups.find(g => g.seller.id === sellerId);
    if (!group) return;
    const allSelected = group.items.every(i => selectedItems[i.id]);
    const map = { ...selectedItems };
    group.items.forEach(i => (map[i.id] = !allSelected));
    setSelectedItems(map);
    setSelectAll(allItemIds.every(id => map[id]));
  };

  const toggleItem = itemId => {
    const map = { ...selectedItems, [itemId]: !selectedItems[itemId] };
    setSelectedItems(map);
    setSelectAll(allItemIds.every(id => map[id]));
  };

  // ─── Totals ───────────────────────────────────────────────────────────────
  const selectedCount = allItemIds.filter(id => selectedItems[id]).length;

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

  // ─── Proceed to Checkout ──────────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    const selectedGroups = cartGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => selectedItems[item.id]),
      }))
      .filter(group => group.items.length > 0);

    // Pass both the selected items AND the active promo so checkout page can use both
    prepareCheckout(selectedGroups, appliedPromo);
    router.push('/checkout');
  };

  // ─── Empty / loading states ───────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading cart…</div>
      </div>
    );
  }

  if (cartGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiShoppingCart className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items yet
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-gray-600">
            {selectedQtyTotal} items selected
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main cart list ─────────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Select-all header */}
              <div className="p-4 border-b border-gray-100 flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Select All ({allItemIds.length}{' '}
                    {allItemIds.length === 1 ? 'product' : 'products'})
                  </span>
                </label>
              </div>

              {/* Seller groups */}
              {cartGroups.map(sellerGroup => (
                <div
                  key={sellerGroup.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Seller header */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sellerGroup.items.every(
                            item => !!selectedItems[item.id],
                          )}
                          onChange={() =>
                            toggleSellerGroup(sellerGroup.seller.id)
                          }
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {sellerGroup.seller.name}
                        </span>
                        {sellerGroup.seller.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-orange-600 transition">
                      Message Seller
                    </button>
                  </div>

                  {/* Items */}
                  {sellerGroup.items.map(item => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row gap-4 border-t border-gray-100"
                    >
                      {/* Checkbox */}
                      <div className="flex items-start sm:items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[item.id]}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 mt-1 sm:mt-0"
                        />
                      </div>

                      {/* Product image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiAlertCircle size={24} />
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-orange-600 line-clamp-2 block"
                        >
                          {item.name}
                        </Link>
                        {item.variant && item.variant !== '—' && (
                          <p className="text-sm text-gray-500 mt-1">
                            Variant: {item.variant}
                          </p>
                        )}
                        {item.moq > 1 && (
                          <p className="text-sm text-gray-500">
                            MOQ: {item.moq} pieces
                          </p>
                        )}
                        {item.stock <= 10 && item.stock > 0 && (
                          <p className="text-xs text-red-500 mt-1">
                            Only {item.stock} left in stock!
                          </p>
                        )}
                      </div>

                      {/* Price, quantity & subtotal */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                        <div className="text-lg font-bold text-orange-600">
                          ${item.price.toFixed(2)}
                          <span className="text-xs font-normal text-gray-400 ml-1">
                            / unit
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            disabled={item.quantity <= item.moq}
                            className="w-8 h-8 border border-gray-200 rounded-l flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e => handleQtyInput(item, e.target.value)}
                            className="w-16 h-8 border-t border-b border-gray-200 text-center text-sm focus:outline-none"
                            min={item.moq}
                            max={item.maxQuantity}
                            step={item.moq}
                          />
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="w-8 h-8 border border-gray-200 rounded-r flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm text-gray-500">
                          Subtotal:{' '}
                          <span className="font-medium text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition self-start sm:self-center"
                        title="Remove item"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <Link
              href="/products"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mt-4 transition"
            >
              <FiChevronRight className="rotate-180 mr-1" />
              Continue Shopping
            </Link>
          </div>

          {/* ── Order summary sidebar ───────────────────────────────────────── */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              {/* Price breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Products ({selectedCount} selected)
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount line — only shown when a code is applied */}
                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      🏷️ {appliedPromo.code}
                    </span>
                    <span className="font-semibold">
                      −${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Shipping</span>
                  <span className="italic">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Tax</span>
                  <span className="italic">Calculated at next step</span>
                </div>

                {/* Grand total */}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Savings callout */}
                {appliedPromo && discountAmount > 0 && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 text-center">
                    🎉 You're saving{' '}
                    <span className="font-bold">
                      ${discountAmount.toFixed(2)}
                    </span>{' '}
                    with <span className="font-bold">{appliedPromo.code}</span>
                  </p>
                )}
              </div>

              {/* No selection warning */}
              {selectedCount === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <FiAlertCircle size={14} />
                  Select at least one item to proceed.
                </p>
              )}

              {/* Proceed button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedCount === 0}
                className={`w-full py-3 text-white text-center font-semibold rounded-xl transition ${
                  selectedCount > 0
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout
              </button>

              {/* ── Promo Code Component ── */}
              <PromoCodeInput
                subtotal={subtotal}
                onApply={promo => setAppliedPromo(promo)}
                onRemove={() => setAppliedPromo(null)}
              />

              {/* Trust badges */}
              <div className="mt-2 text-center text-xs text-gray-500 space-y-1">
                <p>✓ Secure Checkout</p>
                <p>✓ Buyer Protection</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">Visa</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">MC</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
