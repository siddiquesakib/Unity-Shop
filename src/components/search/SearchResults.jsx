// components/search/SearchResults.jsx
"use client";

import { useState, useEffect } from "react";
import ProductCardB2B from "@/components/product/ProductCardB2B";
import { FiGrid, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Mock results data
const mockResults = Array.from({ length: 24 }, (_, i) => ({
  id: `result-${i + 1}`,
  name: `High-Quality Product ${i + 1} with Long Name That Might Wrap`,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format",
  ],
  priceMin: 5.99 + i * 2,
  priceMax: 12.99 + i * 3,
  unit: "piece",
  moq: 100 + i * 50,
  discount: i % 3 === 0 ? 10 : null,
  isNew: i < 3,
  supplier: {
    name: `Supplier ${i + 1}`,
    location: i % 2 === 0 ? "Shenzhen, China" : "Guangzhou, China",
    rating: 4.5 + (i % 5) * 0.1,
    responseRate: 95 + (i % 5),
  },
  reviewCount: 100 + i * 10,
}));

const SearchResults = ({ query, filters }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 24;

  // Simulate fetching results
  useEffect(() => {
    setLoading(true);
    // In real app, fetch with query, filters, page, sort
    setTimeout(() => {
      let filtered = [...mockResults];

      // Apply search query (simple mock)
      if (query) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        );
      }

      // Apply filters (simplified)
      if (filters.priceMin) {
        filtered = filtered.filter(
          (p) => p.priceMin >= Number(filters.priceMin),
        );
      }
      if (filters.priceMax) {
        filtered = filtered.filter(
          (p) => p.priceMax <= Number(filters.priceMax),
        );
      }
      if (filters.rating > 0) {
        filtered = filtered.filter((p) => p.supplier.rating >= filters.rating);
      }

      setTotalResults(filtered.length);
      setResults(filtered.slice(0, resultsPerPage));
      setLoading(false);
    }, 500);
  }, [query, filters, currentPage, sortBy]);

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

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
              {categories.find((c) => c.id === filters.category)?.name}
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
            <ProductCardB2B key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-gray-100"
            >
              {/* List view item - can be expanded later */}
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Supplier: {product.supplier.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                      ${product.priceMin}
                    </span>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">
                      Contact
                    </button>
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

// Helper for category name lookup (should be imported or defined)
const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home-garden", name: "Home & Garden" },
  { id: "health-beauty", name: "Health & Beauty" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "toys", name: "Toys & Kids" },
  { id: "automotive", name: "Automotive" },
  { id: "office", name: "Office Supplies" },
];

export default SearchResults;
