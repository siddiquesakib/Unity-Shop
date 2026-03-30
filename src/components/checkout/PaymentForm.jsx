// components/checkout/PaymentForm.jsx
"use client";

import { useState } from "react";
import Button from "@/components/common/Button";

const PaymentForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(
    initialData || {
      method: "credit",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
      billingSameAsShipping: true,
    },
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-black tracking-tight uppercase">
          Payment Method
        </h2>
        <div className="w-10 h-0.5 bg-black mt-2 rounded-full" />
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.method === "credit" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          <input
            type="radio"
            name="method"
            value="credit"
            checked={formData.method === "credit"}
            onChange={handleChange}
            className="w-4 h-4 accent-black"
          />
          <div className="ml-3 flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Credit/Debit Card</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-medium">
              Visa/MC/Amex
            </span>
          </div>
        </label>

        <label
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.method === "paypal" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          <input
            type="radio"
            name="method"
            value="paypal"
            checked={formData.method === "paypal"}
            onChange={handleChange}
            className="w-4 h-4 accent-black"
          />
          <div className="ml-3">
            <span className="text-gray-700 font-medium">PayPal</span>
          </div>
        </label>

        <label
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.method === "bank" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          <input
            type="radio"
            name="method"
            value="bank"
            checked={formData.method === "bank"}
            onChange={handleChange}
            className="w-4 h-4 accent-black"
          />
          <div className="ml-3">
            <span className="text-gray-700 font-medium">Bank Transfer</span>
          </div>
        </label>
      </div>

      {formData.method === "credit" && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="saveCard"
              id="saveCard"
              checked={formData.saveCard}
              onChange={handleChange}
              className="w-4 h-4 accent-black rounded"
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Billing Address
        </h3>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="billingSameAsShipping"
            id="billingSameAsShipping"
            checked={formData.billingSameAsShipping}
            onChange={handleChange}
            className="w-4 h-4 accent-black rounded"
          />
          <label
            htmlFor="billingSameAsShipping"
            className="ml-2 text-sm text-gray-700"
          >
            Same as shipping address
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-black hover:text-black transition-all duration-300"
        >
          Back
        </button>
        <Button
          type="submit"
          showIcon={false}
          className="!px-8 !py-3 font-bold"
        >
          Continue to Review
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
