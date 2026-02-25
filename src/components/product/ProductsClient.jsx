// src/components/product/ProductsClient.jsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, {
  categories,
} from "@/components/product/ProductFilters";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PRODUCTS_PER_PAGE = 30;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
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
    <div className="min-h-screen bg-stone-50">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-amber-800 font-medium mb-2">
                Our Store
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-light text-stone-900 tracking-tight leading-none">
                {searchQuery ? `"${searchQuery}"` : activeLabel}
              </h1>
              <p className="font-body text-stone-500 text-lg mt-3">
                {displayCount} {displayCount === 1 ? "product" : "products"}{" "}
                found
                {searchQuery && activeCategory !== "all" && (
                  <span className="text-stone-400"> in {activeLabel}</span>
                )}
                {totalPages > 1 && (
                  <span className="text-stone-400 ml-2">
                    · Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-80">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl border border-stone-200 p-6">
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ── Toolbar ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile filter trigger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 bg-white text-sm text-stone-700 hover:border-stone-400 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18M7 12h10M11 20h2"
                  />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-amber-700 rounded-full" />
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-stone-200 rounded-full px-4 py-2.5 bg-white text-stone-700 focus:outline-none focus:border-stone-900 transition-all cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* Grid / List toggle */}
                <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`p-2 rounded-full transition-all ${view === "grid" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V2zM1 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM1 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`p-2 rounded-full transition-all ${view === "list" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Active Filter Chips ──────────────────────────────────── */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-full">
                    {activeLabel}
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className="hover:text-stone-300"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {priceRange[1] < 5000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-full">
                    Under ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 5000])}
                      className="hover:text-stone-300"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {onSaleOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs rounded-full">
                    On Sale
                    <button
                      onClick={() => setOnSaleOnly(false)}
                      className="hover:text-rose-200"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-full">
                    {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-stone-300"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* ── Product Grid / List ──────────────────────────────────── */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5"
                      : "flex flex-col gap-4"
                  }
                >
                  {products.map((product, i) => (
                    <div
                      key={product._id || product.id || i}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <ProductCard product={product} view={view} />
                    </div>
                  ))}
                </div>

                {/* ── Pagination ──────────────────────────────────────── */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 mb-4">
                    {/* Prev */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-900 hover:text-stone-900 transition-all"
                    >
                      <FiChevronLeft size={18} />
                    </button>

                    {/* Page numbers */}
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
                            className="w-10 h-10 flex items-center justify-center text-stone-400 text-sm"
                          >
                            ···
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                              currentPage === p
                                ? "bg-stone-900 text-white"
                                : "border border-stone-200 bg-white text-stone-600 hover:border-stone-900 hover:text-stone-900"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      );
                    })()}

                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-900 hover:text-stone-900 transition-all"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // ── Empty State ──────────────────────────────────────────
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-linear-to-br from-stone-100 to-amber-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-stone-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold text-stone-800 mb-3">
                  {activeCategory !== "all"
                    ? `No products in "${activeLabel || activeCategory}"`
                    : "No products found"}
                </h3>
                <p className="font-body text-stone-400 mb-8 max-w-md mx-auto">
                  {activeCategory !== "all"
                    ? "This category doesn't have any products yet. Check back later or browse other categories!"
                    : "Try adjusting your filters or search term to find what you're looking for."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-stone-900 text-white rounded-full text-sm hover:bg-amber-800 transition-colors"
                  >
                    Browse All Products
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 border border-stone-300 text-stone-700 rounded-full text-sm hover:border-stone-500 transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-display text-xl font-light text-stone-900">
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
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
