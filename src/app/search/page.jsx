// app/search/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import { FiFilter } from "react-icons/fi";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryParam,
    priceMin: "",
    priceMax: "",
    moq: "",
    supplierLocation: [],
    tradeAssurance: false,
    verifiedOnly: false,
    rating: 0,
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
    }));
  }, [categoryParam]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // In a real app, you'd fetch results with these filters
    console.log("Applying filters:", filters);
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-orange-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>Search</li>
            {query && (
              <>
                <li>/</li>
                <li className="text-gray-900 font-medium">"{query}"</li>
              </>
            )}
          </ol>
        </nav>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Desktop layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters - desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <SearchResults query={query} filters={filters} />
          </div>
        </div>

        {/* Mobile filters drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApply={handleApplyFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
