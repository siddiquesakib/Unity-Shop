// components/search/SearchFilters.jsx
"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const categories = [
  { id: "electronics", name: "Electronics", count: 1234 },
  { id: "fashion", name: "Fashion", count: 2345 },
  { id: "home-garden", name: "Home & Garden", count: 1832 },
  { id: "health-beauty", name: "Health & Beauty", count: 921 },
  { id: "sports", name: "Sports & Outdoors", count: 756 },
  { id: "toys", name: "Toys & Kids", count: 643 },
  { id: "automotive", name: "Automotive", count: 512 },
  { id: "office", name: "Office Supplies", count: 389 },
];

const locations = [
  { id: "china", name: "China", count: 4500 },
  { id: "india", name: "India", count: 2100 },
  { id: "vietnam", name: "Vietnam", count: 890 },
  { id: "usa", name: "United States", count: 750 },
  { id: "germany", name: "Germany", count: 430 },
  { id: "japan", name: "Japan", count: 320 },
];

const SearchFilters = ({ filters, onFilterChange, onApply }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    moq: true,
    location: true,
    other: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (type, value) => {
    if (type === "category") {
      onFilterChange({
        ...filters,
        category: value === filters.category ? "" : value,
      });
    } else if (type === "supplierLocation") {
      const newLocations = filters.supplierLocation.includes(value)
        ? filters.supplierLocation.filter((l) => l !== value)
        : [...filters.supplierLocation, value];
      onFilterChange({ ...filters, supplierLocation: newLocations });
    }
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: "",
      priceMin: "",
      priceMax: "",
      moq: "",
      supplierLocation: [],
      tradeAssurance: false,
      verifiedOnly: false,
      rating: 0,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category filter */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Category</span>
          {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.category === cat.id}
                  onChange={() => handleCheckboxChange("category", cat.id)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{cat.name}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  {cat.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Price Range</span>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.price && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) =>
                onFilterChange({ ...filters, priceMin: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) =>
                onFilterChange({ ...filters, priceMax: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        )}
      </div>

      {/* MOQ */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("moq")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Minimum Order Quantity</span>
          {expandedSections.moq ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.moq && (
          <input
            type="number"
            placeholder="Enter MOQ"
            value={filters.moq}
            onChange={(e) =>
              onFilterChange({ ...filters, moq: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 mt-2"
          />
        )}
      </div>

      {/* Supplier Location */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("location")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Supplier Location</span>
          {expandedSections.location ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.location && (
          <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
            {locations.map((loc) => (
              <label
                key={loc.id}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.supplierLocation.includes(loc.id)}
                  onChange={() =>
                    handleCheckboxChange("supplierLocation", loc.id)
                  }
                  className="text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700">{loc.name}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  {loc.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Other filters */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("other")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Supplier Features</span>
          {expandedSections.other ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.other && (
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.tradeAssurance}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    tradeAssurance: e.target.checked,
                  })
                }
                className="text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Trade Assurance</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) =>
                  onFilterChange({ ...filters, verifiedOnly: e.target.checked })
                }
                className="text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700">Verified Supplier</span>
            </label>
          </div>
        )}
      </div>

      {/* Rating filter */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
        >
          <span>Rating</span>
          {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2 mt-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === star}
                  onChange={() => handleRatingChange(star)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{star} stars & above</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Apply button */}
      <button
        onClick={onApply}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default SearchFilters;
