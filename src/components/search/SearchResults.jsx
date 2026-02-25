// components/search/SearchResults.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";
import ProductCard from "../product/ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const allCategories = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "living", name: "Home & Living" },
  { id: "kitchen", name: "Kitchen" },
  { id: "bedroom", name: "Bedroom" },
  { id: "office", name: "Office" },
  { id: "mobile", name: "Mobiles" },
  { id: "watches", name: "Watches" },
  { id: "audio", name: "Audio" },
  { id: "cameras", name: "Cameras" },
  { id: "gaming", name: "Gaming" },
  { id: "lighting", name: "Lighting" },
  { id: "beauty", name: "Beauty" },
  { id: "health", name: "Health" },
  { id: "sports", name: "Sports" },
  { id: "outdoor", name: "Outdoor" },
  { id: "books", name: "Books" },
  { id: "stationery", name: "Stationery" },
  { id: "toys", name: "Toys & Baby" },
  { id: "grocery", name: "Grocery" },
  { id: "tools", name: "Tools" },
  { id: "automotive", name: "Automotive" },
];

const SearchResults = ({ query, filters }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 24;

  // Fetch results from backend
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filters.category) params.set("category", filters.category);
      if (filters.priceMin) params.set("priceMin", filters.priceMin);
      if (filters.priceMax) params.set("priceMax", filters.priceMax);
      if (filters.rating > 0) params.set("rating", filters.rating);
      params.set("sort", sortBy);
      params.set("page", currentPage);
      params.set("limit", resultsPerPage);

      const res = await fetch(
        `${API_URL}/products/search?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();

      setResults(data.products || []);
      setTotalResults(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Search fetch error:", err);
      setError("Could not load results. Please try again.");
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [query, filters, sortBy, currentPage, resultsPerPage]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Reset to page 1 when query/filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters, sortBy]);

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl aspect-square"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FiAlertCircle size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">Something went wrong</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={fetchResults}
          className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FiSearch size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-1">No products found</p>
        <p className="text-sm">
          {query
            ? `No results for "${query}". Try a different search.`
            : "Try searching for something."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {totalResults.toLocaleString()} products found
          </h1>
          {query && <p className="text-gray-600">for "{query}"</p>}
        </div>

        <div className="flex items-center space-x-4">
          {/* View toggle */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded ${view === "grid" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-orange-500"}`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded ${view === "list" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-orange-500"}`}
            >
              <FiList size={18} />
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters chips */}
      {(filters.category ||
        filters.priceMin ||
        filters.priceMax ||
        filters.rating > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Category:{" "}
              {categories.find((c) => c.id === filters.category)?.name ||
                filters.category}
              <button
                onClick={() => onFilterChange?.({ ...filters, category: "" })}
                className="ml-2 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
          {(filters.priceMin || filters.priceMax) && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Price: {filters.priceMin ? `$${filters.priceMin}` : "Any"} -{" "}
              {filters.priceMax ? `$${filters.priceMax}` : "Any"}
              <button
                onClick={() =>
                  onFilterChange?.({ ...filters, priceMin: "", priceMax: "" })
                }
                className="ml-2 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.rating > 0 && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              {filters.rating}★ & above
              <button
                onClick={() => onFilterChange?.({ ...filters, rating: 0 })}
                className="ml-2 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results grid/list */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl p-4 border border-gray-100"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.category && (
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {product.category}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {product.description || "No description"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.rating > 0 && (
                      <span className="text-sm text-gray-500">
                        ★ {product.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500"
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === pageNum
                    ? "bg-orange-500 text-white"
                    : "border border-gray-200 hover:border-orange-500"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

// Use allCategories defined at top for category name lookup
const categories = allCategories;

export default SearchResults;
