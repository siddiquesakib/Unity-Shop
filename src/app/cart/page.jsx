// app/cart/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiTrash2,
  FiShoppingCart,
  FiHeart,
  FiChevronRight,
} from "react-icons/fi";

// Mock cart data
const mockCartItems = [
  {
    id: "cart-1",
    seller: {
      id: "seller-1",
      name: "Shenzhen Electronics Co.",
      verified: true,
    },
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Wireless Bluetooth Headphones with Noise Cancellation",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format",
        price: 18.5,
        quantity: 100,
        moq: 100,
        maxQuantity: 5000,
        variant: "Black",
        stock: 2500,
      },
      {
        id: "item-2",
        productId: "prod-2",
        name: "Bluetooth Speaker Portable Waterproof",
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&auto=format",
        price: 12.8,
        quantity: 200,
        moq: 50,
        maxQuantity: 3000,
        variant: "Blue",
        stock: 1800,
      },
    ],
  },
  {
    id: "cart-2",
    seller: {
      id: "seller-2",
      name: "Guangzhou Fashion Ltd.",
      verified: true,
    },
    items: [
      {
        id: "item-3",
        productId: "prod-3",
        name: "Men's Cotton T-Shirts (Wholesale Pack)",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format",
        price: 3.5,
        quantity: 500,
        moq: 200,
        maxQuantity: 10000,
        variant: "Black, Size M",
        stock: 8500,
      },
    ],
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let itemCount = 0;

    cartItems.forEach((sellerGroup) => {
      sellerGroup.items.forEach((item) => {
        if (selectedItems[item.id]) {
          subtotal += item.price * item.quantity;
          itemCount += item.quantity;
        }
      });
    });

    return { subtotal, itemCount };
  };

  const { subtotal, itemCount } = calculateTotals();

  // Handle quantity change
  const updateQuantity = (sellerIndex, itemIndex, newQuantity) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[sellerIndex].items[itemIndex];
    const validQuantity = Math.min(
      Math.max(newQuantity, item.moq),
      item.maxQuantity,
    );
    updatedCart[sellerIndex].items[itemIndex].quantity = validQuantity;
    setCartItems(updatedCart);
  };

  // Remove item
  const removeItem = (sellerIndex, itemIndex) => {
    const updatedCart = [...cartItems];
    updatedCart[sellerIndex].items.splice(itemIndex, 1);
    if (updatedCart[sellerIndex].items.length === 0) {
      updatedCart.splice(sellerIndex, 1);
    }
    setCartItems(updatedCart);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelected = {};
    cartItems.forEach((sellerGroup) => {
      sellerGroup.items.forEach((item) => {
        newSelected[item.id] = newSelectAll;
      });
    });
    setSelectedItems(newSelected);
  };

  // Toggle single item
  const toggleItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev, [itemId]: !prev[itemId] };

      // Check if all items are selected
      let allSelected = true;
      cartItems.forEach((sellerGroup) => {
        sellerGroup.items.forEach((item) => {
          if (!newSelected[item.id]) allSelected = false;
        });
      });
      setSelectAll(allSelected);

      return newSelected;
    });
  };

  // Toggle seller group
  const toggleSellerGroup = (sellerId) => {
    const sellerItems =
      cartItems.find((g) => g.seller.id === sellerId)?.items || [];
    const allSelected = sellerItems.every((item) => selectedItems[item.id]);

    const newSelected = { ...selectedItems };
    sellerItems.forEach((item) => {
      newSelected[item.id] = !allSelected;
    });

    // Update select all
    let allItemsSelected = true;
    cartItems.forEach((sellerGroup) => {
      sellerGroup.items.forEach((item) => {
        if (!newSelected[item.id]) allItemsSelected = false;
      });
    });
    setSelectAll(allItemsSelected);

    setSelectedItems(newSelected);
  };

  if (cartItems.length === 0) {
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-gray-600">{itemCount} items selected</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main cart items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Select all header */}
              <div className="p-4 border-b border-gray-100 flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700 font-medium">Select All</span>
                </label>
              </div>

              {/* Seller groups */}
              {cartItems.map((sellerGroup, sellerIndex) => (
                <div
                  key={sellerGroup.seller.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Seller header */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sellerGroup.items.every(
                            (item) => selectedItems[item.id],
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
                    <button className="text-sm text-gray-500 hover:text-orange-600">
                      Message Seller
                    </button>
                  </div>

                  {/* Items */}
                  {sellerGroup.items.map((item, itemIndex) => (
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-orange-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Variant: {item.variant}
                        </p>
                        <p className="text-sm text-gray-500">
                          MOQ: {item.moq} pieces
                        </p>
                      </div>

                      {/* Price and quantity */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                        <div className="text-lg font-bold text-orange-600">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                sellerIndex,
                                itemIndex,
                                item.quantity - item.moq,
                              )
                            }
                            className="w-8 h-8 border border-gray-200 rounded-l flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                sellerIndex,
                                itemIndex,
                                parseInt(e.target.value) || item.moq,
                              )
                            }
                            className="w-16 h-8 border-t border-b border-gray-200 text-center text-sm focus:outline-none"
                            min={item.moq}
                            max={item.maxQuantity}
                            step={item.moq}
                          />
                          <button
                            onClick={() =>
                              updateQuantity(
                                sellerIndex,
                                itemIndex,
                                item.quantity + item.moq,
                              )
                            }
                            className="w-8 h-8 border border-gray-200 rounded-r flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(sellerIndex, itemIndex)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Continue shopping link */}
            <Link
              href="/products"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mt-4"
            >
              <FiChevronRight className="rotate-180 mr-1" />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at next step</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-600">Calculated at next step</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center font-semibold rounded-xl hover:shadow-lg transition mb-3"
              >
                Proceed to Checkout
              </Link>

              {/* Promo code */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:border-orange-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-r-lg hover:bg-gray-200 transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 text-center text-xs text-gray-500">
                <p className="mb-2">✓ Secure Checkout</p>
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
