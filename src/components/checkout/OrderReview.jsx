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
      <div>
        <h2 className="text-xl font-black text-black tracking-tight uppercase">
          Review Your Order
        </h2>
        <div className="w-10 h-0.5 bg-black mt-2 rounded-full" />
      </div>

      {/* Shipping address */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-black text-sm">Shipping Address</h3>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-medium text-gray-400 hover:text-black transition-colors"
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
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-black text-sm">Payment Method</h3>
          <button
            type="button"
            onClick={() => onBack()}
            className="text-xs font-medium text-gray-400 hover:text-black transition-colors"
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
        <h3 className="font-bold text-black text-sm mb-3">Items</h3>
        <div className="space-y-3">
          {cartItems.map((sellerGroup) => (
            <div
              key={sellerGroup.seller.id}
              className="border border-gray-100 rounded-2xl p-4"
            >
              <p className="font-semibold text-sm mb-2 text-gray-800">
                {sellerGroup.seller.name}
              </p>
              {sellerGroup.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden">
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
          <span className="text-black font-black text-xl">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-4 h-4 accent-black rounded"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-black font-semibold hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-black font-semibold hover:underline"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-black hover:text-black transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={!termsAccepted || isPlacingOrder}
          className="px-8 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center"
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
