// components/checkout/OrderReview.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";

const OrderReview = ({
  shippingData,
  paymentData,
  cartItems,
  totalPrice,
  onBack,
  onPlaceOrder,
  isPlacingOrder,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>

      {/* Shipping address */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Shipping Address</h3>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">
          {shippingData.fullName}
          <br />
          {shippingData.addressLine1}
          <br />
          {shippingData.addressLine2 && (
            <>
              {shippingData.addressLine2}
              <br />
            </>
          )}
          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          <br />
          {shippingData.country}
          <br />
          Phone: {shippingData.phone}
        </p>
      </div>

      {/* Payment method */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Payment Method</h3>
          <button
            type="button"
            onClick={() => onBack()}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">
          {paymentData.method === "credit" && (
            <>Credit Card ending in {paymentData.cardNumber.slice(-4)}</>
          )}
          {paymentData.method === "paypal" && <>PayPal</>}
          {paymentData.method === "bank" && <>Bank Transfer</>}
        </p>
      </div>

      {/* Items */}
      <div>
        <h3 className="font-medium mb-3">Items</h3>
        <div className="space-y-3">
          {cartItems.map((sellerGroup) => (
            <div
              key={sellerGroup.seller.id}
              className="border border-gray-100 rounded-lg p-3"
            >
              <p className="font-medium text-sm mb-2">
                {sellerGroup.seller.name}
              </p>
              {sellerGroup.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
          I agree to the{" "}
          <Link href="/terms" className="text-orange-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={!termsAccepted || isPlacingOrder}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isPlacingOrder ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Placing Order...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;
