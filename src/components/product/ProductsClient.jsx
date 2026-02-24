// src/components/product/ProductsClient.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, {
  categories,
} from "@/components/product/ProductFilters";

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

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  // Sync activeCategory when URL param changes
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  // Update URL when category changes (without full page reload)
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === "all") {
      router.push("/products", { scroll: false });
    } else {
      router.push(`/products?category=${encodeURIComponent(cat)}`, {
        scroll: false,
      });
    }
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleReset = () => {
    handleCategoryChange("all");
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSortBy("featured");
    setOnSaleOnly(false);
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (activeCategory !== "all")
      list = list.filter((p) => p.category === activeCategory);

    if (searchQuery)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    if (onSaleOnly) list = list.filter((p) => p.originalPrice !== null);

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    return list;
  }, [activeCategory, searchQuery, sortBy, priceRange, onSaleOnly]);

  const activeLabel = categories.find((c) => c.id === activeCategory)?.label;
  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery ||
    onSaleOnly ||
    priceRange[1] < 5000;

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
                {activeLabel}
              </h1>
              <p className="font-body text-stone-500 text-lg mt-3">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : filteredProducts.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product, i) => (
                  <div
                    key={product._id || product.id || i}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <ProductCard product={product} view={view} />
                  </div>
                ))}
              </div>
            ) : (
              // ── Empty State ──────────────────────────────────────────
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-stone-100 to-amber-50 rounded-full flex items-center justify-center">
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
