// src/components/product/ProductsClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, {
  categories,
} from "@/components/product/ProductFilters";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
  FiSliders,
  FiGrid,
  FiList,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

const PRODUCTS_PER_PAGE = 30;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// ─── MAIN COMPONENTT ───────────────────────────────────────────────────────────

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get("category") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sync from URL params
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Build URL params for browser history
  const buildUrl = (cat, q) => {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (q && q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    router.push(buildUrl(cat, searchQuery), { scroll: false });
  };

  // Debounce search input — fetch after user stops typing (400ms)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from backend search endpoint
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch && debouncedSearch.trim())
        params.set("q", debouncedSearch.trim());
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (priceRange[0] > 0) params.set("priceMin", priceRange[0]);
      if (priceRange[1] < 5000) params.set("priceMax", priceRange[1]);

      // Map sortBy to backend sort
      const sortMap = {
        featured: "recommended",
        newest: "newest",
        "price-asc": "price-asc",
        "price-desc": "price-desc",
        rating: "rating",
      };
      params.set("sort", sortMap[sortBy] || "recommended");
      params.set("page", currentPage);
      params.set("limit", PRODUCTS_PER_PAGE);

      const res = await fetch(
        `${API_URL}/products/search?${params.toString()}`,
      );
      if (res.ok) {
        const data = await res.json();
        let list = data.products || [];

        // Client-side sale filter (backend doesn't have this)
        if (onSaleOnly) {
          list = list.filter(
            (p) => p.originalPrice && p.originalPrice > p.price,
          );
        }

        setProducts(list);
        setTotalResults(onSaleOnly ? list.length : data.total || 0);
        setTotalPages(
          onSaleOnly
            ? Math.ceil(list.length / PRODUCTS_PER_PAGE)
            : data.totalPages || 0,
        );
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    activeCategory,
    sortBy,
    currentPage,
    priceRange,
    onSaleOnly,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page to 1 when filters change (but not currentPage itself)
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, debouncedSearch, sortBy, priceRange, onSaleOnly]);

  const handleReset = () => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSortBy("featured");
    setOnSaleOnly(false);
    setCurrentPage(1);
    handleCategoryChange("all");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeLabel = categories.find((c) => c.id === activeCategory)?.label;
  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery ||
    onSaleOnly ||
    priceRange[1] < 5000;

  const displayCount = totalResults || products.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Shop
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {searchQuery ? `"${searchQuery}"` : activeLabel}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                {displayCount} {displayCount === 1 ? "product" : "products"}{" "}
                found
                {searchQuery && activeCategory !== "all" && (
                  <span className="text-gray-400"> in {activeLabel}</span>
                )}
                {totalPages > 1 && (
                  <span className="text-gray-400 ml-1">
                    &middot; Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-gray-200 p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <ProductFilters
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onSaleOnly={onSaleOnly}
                setOnSaleOnly={setOnSaleOnly}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition-all"
              >
                <FiSliders size={15} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-black rounded-full" />
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-full px-4 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-black transition-all cursor-pointer font-medium"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`p-2 rounded-full transition-all ${
                      view === "grid"
                        ? "bg-black text-white"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <FiGrid size={15} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`p-2 rounded-full transition-all ${
                      view === "list"
                        ? "bg-black text-white"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <FiList size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-full">
                    {activeLabel}
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className="hover:text-gray-300"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {priceRange[1] < 5000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-full">
                    Under ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 5000])}
                      className="hover:text-gray-300"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {onSaleOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full">
                    On Sale
                    <button
                      onClick={() => setOnSaleOnly(false)}
                      className="hover:text-red-200"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-full">
                    &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-gray-300"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {products.map((product, i) => (
                    <div
                      key={product._id || product.id || i}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <ProductCard product={product} view={view} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-10">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-black hover:text-black transition-all"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {(() => {
                      const pages = [];
                      const maxVisible = 7;
                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (currentPage > 3) pages.push("...");
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (currentPage < totalPages - 2) pages.push("...");
                        pages.push(totalPages);
                      }

                      return pages.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`dots-${idx}`}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                              currentPage === p
                                ? "bg-black text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      );
                    })()}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-black hover:text-black transition-all"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiPackage className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Try adjusting your filters or search term to find what
                  you&apos;re looking for.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Browse All
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:border-gray-400 transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-5">
              <ProductFilters
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onSaleOnly={onSaleOnly}
                setOnSaleOnly={setOnSaleOnly}
                onReset={handleReset}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
