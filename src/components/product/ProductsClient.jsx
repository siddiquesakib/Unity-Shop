// src/components/product/ProductsClient.jsx
"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, {
  categories,
} from "@/components/product/ProductFilters";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
// TODO: replace with useFetch(@/hooks/useFetch) hitting /api/products

const allProducts = [
  {
    id: 1,
    category: "living",
    name: "Bouclé Accent Chair",
    price: 320,
    originalPrice: 420,
    badge: "Sale",
    description: "Cloud-soft textured fabric",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    category: "kitchen",
    name: "Matte Ceramic Mug",
    price: 48,
    originalPrice: null,
    badge: "New",
    description: "Set of 4, hand-thrown clay",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 3,
    category: "lighting",
    name: "Wasabi Table Lamp",
    price: 175,
    originalPrice: null,
    badge: "Best Seller",
    description: "Organic linen shade, brass base",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    rating: 4.7,
    reviews: 210,
  },
  {
    id: 4,
    category: "stationery",
    name: "Leather Desk Journal",
    price: 64,
    originalPrice: null,
    badge: null,
    description: "Full-grain leather, 200 pages",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    rating: 4.6,
    reviews: 56,
  },
  {
    id: 5,
    category: "bedroom",
    name: "Merino Blanket",
    price: 98,
    originalPrice: null,
    badge: "Trending",
    description: "Ethically sourced merino wool",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
    rating: 4.9,
    reviews: 175,
  },
  {
    id: 6,
    category: "living",
    name: "Ceramic Vase",
    price: 89,
    originalPrice: 129,
    badge: "Sale",
    description: "Hand-thrown, reactive glaze",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80",
    rating: 4.5,
    reviews: 43,
  },
  {
    id: 7,
    category: "kitchen",
    name: "Wood Cutting Board",
    price: 72,
    originalPrice: null,
    badge: null,
    description: "Single-piece solid olive wood",
    image:
      "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=600&q=80",
    rating: 4.8,
    reviews: 97,
  },
  {
    id: 8,
    category: "lighting",
    name: "Arc Floor Lamp",
    price: 298,
    originalPrice: 380,
    badge: "Sale",
    description: "Matte black, adjustable arm",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80",
    rating: 4.6,
    reviews: 62,
  },
  {
    id: 9,
    category: "bedroom",
    name: "Linen Pillow Cover",
    price: 55,
    originalPrice: null,
    badge: "New",
    description: "Belgian linen, set of 2",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    rating: 4.7,
    reviews: 134,
  },
  {
    id: 10,
    category: "outdoor",
    name: "Garden Lantern",
    price: 42,
    originalPrice: null,
    badge: null,
    description: "Handwoven, weather-resistant",
    image:
      "https://images.unsplash.com/photo-1601999009399-68f5db215851?w=600&q=80",
    rating: 4.4,
    reviews: 29,
  },
  {
    id: 11,
    category: "stationery",
    name: "Brass Pen + Stand",
    price: 38,
    originalPrice: null,
    badge: "New",
    description: "Solid brass, refillable ink",
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
    rating: 4.5,
    reviews: 41,
  },
  {
    id: 12,
    category: "living",
    name: "Wool Rug",
    price: 485,
    originalPrice: 620,
    badge: "Sale",
    description: "2.5m × 3m, natural dyes",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252eef8?w=600&q=80",
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 13,
    category: "kitchen",
    name: "Cast Iron Skillet",
    price: 115,
    originalPrice: null,
    badge: "Best Seller",
    description: "Pre-seasoned, 26cm diameter",
    image:
      "https://images.unsplash.com/photo-1593759608142-e976b9c4d73a?w=600&q=80",
    rating: 4.8,
    reviews: 302,
  },
  {
    id: 14,
    category: "bedroom",
    name: "Soy Pillar Candle",
    price: 44,
    originalPrice: null,
    badge: null,
    description: "Vetiver & cedar, 40hr burn",
    image:
      "https://images.unsplash.com/photo-1603905342474-5b83bf4b8520?w=600&q=80",
    rating: 4.6,
    reviews: 77,
  },
  {
    id: 15,
    category: "lighting",
    name: "Woven Pendant Light",
    price: 210,
    originalPrice: null,
    badge: "Trending",
    description: "Hand-woven rattan shade",
    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80",
    rating: 4.7,
    reviews: 53,
  },
  {
    id: 16,
    category: "stationery",
    name: "Linen Notebook Set",
    price: 29,
    originalPrice: null,
    badge: null,
    description: "A5 size, set of 3, ruled",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    rating: 4.4,
    reviews: 35,
  },
  {
    id: 17,
    category: "outdoor",
    name: "Copper Planter",
    price: 88,
    originalPrice: null,
    badge: "New",
    description: "Aged copper finish, drainage hole",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    rating: 4.5,
    reviews: 21,
  },
  {
    id: 18,
    category: "living",
    name: "Travertine Side Table",
    price: 375,
    originalPrice: null,
    badge: null,
    description: "Natural stone top, powder-coated",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    rating: 4.8,
    reviews: 66,
  },
  {
    id: 19,
    category: "kitchen",
    name: "Stoneware Bowl",
    price: 58,
    originalPrice: 80,
    badge: "Sale",
    description: "Reactive glaze, oven-safe",
    image:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80",
    rating: 4.6,
    reviews: 49,
  },
  {
    id: 20,
    category: "bedroom",
    name: "Walnut Bedside Tray",
    price: 66,
    originalPrice: null,
    badge: null,
    description: "Solid walnut with lip edge",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    rating: 4.7,
    reviews: 38,
  },
  {
    id: 21,
    category: "living",
    name: "Linen Basket",
    price: 49,
    originalPrice: null,
    badge: "New",
    description: "Chunky weave, collapsible",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252eef8?w=600&q=80",
    rating: 4.5,
    reviews: 55,
  },
  {
    id: 22,
    category: "lighting",
    name: "Concrete Desk Lamp",
    price: 145,
    originalPrice: null,
    badge: null,
    description: "Poured concrete base, linen shade",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    rating: 4.6,
    reviews: 44,
  },
  {
    id: 23,
    category: "kitchen",
    name: "Linen Apron",
    price: 52,
    originalPrice: null,
    badge: null,
    description: "Washed Belgian linen, adjustable",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    rating: 4.7,
    reviews: 81,
  },
  {
    id: 24,
    category: "living",
    name: "Marble Bookend Pair",
    price: 95,
    originalPrice: null,
    badge: "Trending",
    description: "Solid white Carrara marble",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    rating: 4.8,
    reviews: 72,
  },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProductsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const handleReset = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setPriceRange([0, 600]);
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
        list.sort((a, b) => b.id - a.id);
        break;
    }

    return list;
  }, [activeCategory, searchQuery, sortBy, priceRange, onSaleOnly]);

  const activeLabel = categories.find((c) => c.id === activeCategory)?.label;
  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery ||
    onSaleOnly ||
    priceRange[1] < 600;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 md:py-14">
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
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl border border-stone-200 p-6">
              <ProductFilters
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
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
                      onClick={() => setActiveCategory("all")}
                      className="hover:text-stone-300"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {priceRange[1] < 600 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-full">
                    Under ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 600])}
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
            {filteredProducts.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
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
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="font-display text-2xl font-light text-stone-700 mb-2">
                  No products found
                </h3>
                <p className="font-body text-stone-400 mb-8">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-stone-900 text-white rounded-full text-sm hover:bg-amber-800 transition-colors"
                >
                  Clear all filters
                </button>
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
                setActiveCategory={setActiveCategory}
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
