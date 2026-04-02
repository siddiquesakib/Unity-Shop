// components/checkout/ShippingForm.jsx
"use client";

import { useState } from "react";

const ShippingForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      saveAddress: true,
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
          Shipping Information
        </h2>
        <div className="w-10 h-0.5 bg-black mt-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP/Postal Code *
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-gray-50/50"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="saveAddress"
          id="saveAddress"
          checked={formData.saveAddress}
          onChange={handleChange}
          className="w-4 h-4 accent-black rounded"
        />
        <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
          Save this address for future orders
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;
