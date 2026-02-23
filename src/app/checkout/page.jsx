// app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderReview from "@/components/checkout/OrderReview";
import { FiCheck, FiLock } from "react-icons/fi";

const steps = [
  { id: "shipping", name: "Shipping", icon: "📍" },
  { id: "payment", name: "Payment", icon: "💳" },
  { id: "review", name: "Review", icon: "✓" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState("shipping");
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [cartItems, orderComplete, router]);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random order number
      const orderNum =
        "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderNumber(orderNum);
      setOrderComplete(true);

      // Clear cart
      clearCart();

      // Redirect to success page after delay
      setTimeout(() => {
        router.push(`/order/success?order=${orderNum}`);
      }, 2000);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getStepStatus = (stepId) => {
    if (currentStep === stepId) return "current";
    if (
      (stepId === "shipping" && shippingData) ||
      (stepId === "payment" && paymentData) ||
      (stepId === "review" && paymentData && shippingData)
    )
      return "complete";
    return "pending";
  };

  // Show order complete state
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order #{orderNumber} has been successfully placed.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We've sent a confirmation email to your inbox.
          </p>
          <Link
            href="/dashboard/orders"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            View Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout progress */}
        <nav className="mb-8">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              return (
                <li key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        status === "complete"
                          ? "bg-green-500 text-white"
                          : status === "current"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {status === "complete" ? <FiCheck /> : step.icon}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        status === "complete" || status === "current"
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 mx-4 bg-gray-200" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {currentStep === "shipping" && (
                <ShippingForm
                  initialData={shippingData}
                  onSubmit={handleShippingSubmit}
                />
              )}
              {currentStep === "payment" && (
                <PaymentForm
                  initialData={paymentData}
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setCurrentStep("shipping")}
                />
              )}
              {currentStep === "review" && (
                <OrderReview
                  shippingData={shippingData}
                  paymentData={paymentData}
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  onBack={() => setCurrentStep("payment")}
                  onPlaceOrder={handlePlaceOrder}
                  isPlacingOrder={isPlacingOrder}
                />
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                {cartItems.map((sellerGroup) => (
                  <div key={sellerGroup.seller.id} className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">
                      {sellerGroup.seller.name}
                    </p>
                    {sellerGroup.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-gray-600"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-600">Calculated</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center mb-2">
                  <FiLock className="mr-1" />
                  <span>Secure Checkout</span>
                </div>
                <p>Your information is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
