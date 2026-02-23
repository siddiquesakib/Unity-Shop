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
      "https://www.lunafurn.com/cdn/shop/products/Bonita-Ivory-Boucle-Accent-Chair-Luna-Furniture-24362493116470.jpg?v=1766894286&width=1214",
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
      "https://m.media-amazon.com/images/I/61vDW+CrR4L._AC_UF894,1000_QL80_.jpg",
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
      "https://i.etsystatic.com/50833053/r/il/70f652/6203456555/il_1080xN.6203456555_79uz.jpg",
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
      "https://m.media-amazon.com/images/I/81nm0wY-T5L._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/61mL5eF+sUL._AC_UF894,1000_QL80_.jpg",
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
    image: "https://m.media-amazon.com/images/I/81XKT5k3Y-L.jpg",
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
      "https://m.media-amazon.com/images/I/81Dvha78PXL._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/c179a522-e3f9-4c09-b693-8ead32a8bec5.__CR0,0,970,600_PT0_SX970_V1___.png",
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
      "https://m.media-amazon.com/images/I/61IKiWblD6L._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/816gjPfgJnL._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/618wX9Rtd7L._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/91aDxPFbj5L._AC_UF894,1000_QL80_.jpg",
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
      "https://www.southernliving.com/thmb/6au1bFnqJOguxeJ7IkdRJJSI8WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/slv-primary-cast-iron-skillets-sep-24-dburreson-001-1-1-eefaede19519484693c0f7c9cdbb3a0b.jpeg",
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
      "https://m.media-amazon.com/images/I/717I73p5evL._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/51dTgdO9c7L._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/71Etky4MukL._AC_UF894,1000_QL80_.jpg",
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
    image: "https://m.media-amazon.com/images/I/81JlCy5DKuL.jpg",
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
    image: "https://urban-road.neto.com.au/assets/images/Oro-Archer%20copy.jpg",
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
      "https://m.media-amazon.com/images/I/51TMxzmGD6L._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/714sIKrRmKL._AC_UF894,1000_QL80_.jpg",
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
      "https://m.media-amazon.com/images/I/51xhPxlDa5L._AC_UF894,1000_QL80_.jpg",
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
    image: "https://cdn01.pinkoi.com/product/skkib4QV/0/9/640x530.jpg",
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
    image: "https://m.media-amazon.com/images/I/71c8e5o7vRL.jpg",
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
      "https://m.media-amazon.com/images/I/61QAf3NfTVL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 72,
  },
  {
    id: 25,
    category: "stationery",
    name: "Fountain Pen Set",
    price: 55,
    originalPrice: null,
    badge: "Trending",
    description: "Vintage style, with ink bottles",
    image:
      "https://newellbrands.imgix.net/b77a014a-442c-30e7-a6f9-de2925b1aa90/b77a014a-442c-30e7-a6f9-de2925b1aa90.jpg?fm=jpg",
    rating: 4.7,
    reviews: 65,
  },
  {
    id: 26,
    category: "bedroom",
    name: "Silk Pillowcase",
    price: 45,
    originalPrice: null,
    badge: "New",
    description: "100% mulberry silk, 300 thread count",
    image:
      "https://m.media-amazon.com/images/I/41KHic6Ra-L._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 27,
    category: "kitchen",
    name: "Bamboo Steamer",
    price: 35,
    originalPrice: null,
    badge: "Trending",
    description: "Two-tier, natural bamboo",
    image:
      "https://m.media-amazon.com/images/I/610g-C4Uu8L._AC_UF894,1000_QL80_.jpg",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 28,
    category: "living",
    name: "LED Strip Lights",
    price: 28,
    originalPrice: null,
    badge: "Best Seller",
    description: "5m, RGB color changing LED strip",
    image:
      "https://m.media-amazon.com/images/I/61sd9XlMzpL._AC_UF894,1000_QL80_.jpg",
    rating: 4.5,
    reviews: 200,
  },
  {
    id: 29,
    category: "living",
    name: "Wall Art Print",
    price: 120,
    originalPrice: null,
    badge: "Sale",
    description: "Framed abstract art",
    image:
      "https://m.media-amazon.com/images/I/71c+zy+x-3L._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 30,
    category: "outdoor",
    name: "Hammock Chair",
    price: 99,
    originalPrice: null,
    badge: "Trending",
    description: "Cotton rope, with stand",
    image:
      "https://m.media-amazon.com/images/I/81d6sEGXtEL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 110,
  },
  {
    id: 31,
    category: "stationery",
    name: "Planner 2024",
    price: 25,
    originalPrice: null,
    badge: "Trending",
    description: "Daily planner with stickers",
    image:
      "https://i.fbcd.co/products/resized/resized-750-500/preview-01-2af35ed048a87bab0395b56e9457941df72e58ea65fff77a33ed1c8692dee1c2.jpg",
    rating: 4.6,
    reviews: 78,
  },
  {
    id: 32,
    category: "bedroom",
    name: "Memory Foam Pillow",
    price: 60,
    originalPrice: null,
    badge: "Trending",
    description: "Ergonomic design",
    image:
      "https://m.media-amazon.com/images/I/51E3IUhCAOL._AC_UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 150,
  },
  {
    id: 33,
    category: "kitchen",
    name: "Spice Rack",
    price: 40,
    originalPrice: null,
    badge: "Trending",
    description: "Wooden, 16 jars",
    image:
      "https://m.media-amazon.com/images/I/61kIUbjJ5gL._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 34,
    category: "lighting",
    name: "Solar Garden Lights",
    price: 55,
    originalPrice: null,
    badge: "New",
    description: "Set of 6, waterproof",
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/59f98b23-c97e-4443-93b9-cd9ad61c362f.__CR0,0,970,600_PT0_SX970_V1___.jpg",
    rating: 4.5,
    reviews: 67,
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
