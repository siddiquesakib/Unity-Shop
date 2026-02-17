// src/components/product/ProductFilters.jsx
"use client";

const categories = [
  { id: "all", label: "All Products", icon: "✦", count: 24 },
  { id: "living", label: "Living Room", icon: "🛋", count: 6 },
  { id: "kitchen", label: "Kitchen", icon: "🫙", count: 5 },
  { id: "bedroom", label: "Bedroom", icon: "🕯", count: 4 },
  { id: "lighting", label: "Lighting", icon: "💡", count: 4 },
  { id: "stationery", label: "Stationery", icon: "📓", count: 3 },
  { id: "outdoor", label: "Outdoor", icon: "🌿", count: 2 },
];

export default function ProductFilters({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  onSaleOnly,
  setOnSaleOnly,
  onReset,
  onClose, // optional — used by mobile drawer to close after selection
}) {
  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    onClose?.();
  };

  return (
    <aside className="flex flex-col gap-8">
      {/* ── Categories ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium mb-4">
          Categories
        </p>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeCategory === cat.id
                  ? "bg-stone-900 text-white shadow-md"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-stone-200 text-stone-500 group-hover:bg-stone-300"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Price Range ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium mb-4">
          Price Range
        </p>
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-stone-700">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={600}
            step={10}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-stone-900 cursor-pointer"
          />
          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-2">
            {[100, 200, 300, 500].map((p) => (
              <button
                key={p}
                onClick={() => setPriceRange([0, p])}
                className={`text-xs py-1.5 rounded-lg border transition-all ${
                  priceRange[1] === p && priceRange[0] === 0
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                Under ${p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── On Sale Toggle ───────────────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium mb-4">
          Promotions
        </p>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              onSaleOnly ? "bg-stone-900" : "bg-stone-200"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                onSaleOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm text-stone-700 group-hover:text-stone-900">
            On Sale Only
          </span>
        </label>
      </div>

      {/* ── Reset ────────────────────────────────────────────────────────── */}
      <button
        onClick={onReset}
        className="text-sm text-stone-400 hover:text-rose-600 transition-colors text-left"
      >
        ↺ Reset all filters
      </button>
    </aside>
  );
}

// Re-export categories so ProductsClient can use the same source of truth
export { categories };
