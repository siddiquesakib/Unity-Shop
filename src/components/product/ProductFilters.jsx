// src/components/product/ProductFilters.jsx
'use client';

import {
  FiGrid,
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiCoffee,
  FiMoon,
  FiMonitor,
  FiPhone,
  FiWatch,
  FiHeadphones,
  FiCamera,
  FiPlay,
  FiSun,
  FiDroplet,
  FiHeart,
  FiActivity,
  FiCompass,
  FiBook,
  FiEdit3,
  FiGift,
  FiShoppingCart,
  FiTool,
  FiTruck,
  FiRefreshCw,
} from 'react-icons/fi';

const categories = [
  { id: 'all', label: 'All Products', icon: FiGrid },
  { id: 'fashion', label: 'Fashion', icon: FiShoppingBag },
  { id: 'electronics', label: 'Electronics', icon: FiSmartphone },
  { id: 'home & living', label: 'Home & Living', icon: FiHome },
  { id: 'beauty', label: 'Beauty', icon: FiDroplet },
  { id: 'watches', label: 'Watches', icon: FiWatch },
  { id: 'toys & baby', label: 'Toys & Baby', icon: FiGift },
  { id: 'mobiles', label: 'Mobiles', icon: FiPhone },
  { id: 'gaming', label: 'Gaming', icon: FiPlay },
  { id: 'sports', label: 'Sports', icon: FiActivity },
  { id: 'books', label: 'Books', icon: FiBook },
  { id: 'grocery', label: 'Grocery', icon: FiShoppingCart },
  { id: 'health', label: 'Health', icon: FiHeart },
  { id: 'kitchen', label: 'Kitchen', icon: FiCoffee },
  { id: 'bedroom', label: 'Bedroom', icon: FiMoon },
  { id: 'office', label: 'Office', icon: FiMonitor },
  { id: 'audio', label: 'Audio', icon: FiHeadphones },
  { id: 'stationery', label: 'Stationery', icon: FiEdit3 },
  { id: 'tools', label: 'Tools', icon: FiTool },
  { id: 'toys', label: 'Toys', icon: FiGift },
  { id: 'auction', label: 'Auction', icon: FiRefreshCw },
];

export default function ProductFilters({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  onSaleOnly,
  setOnSaleOnly,
  onReset,
  onClose,
}) {
  const handleCategoryClick = id => {
    setActiveCategory(id);
    onClose?.();
  };

  return (
    <aside className="flex flex-col gap-7">
      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Categories
        </p>
        <nav className="space-y-0.5">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-white' : 'text-gray-400'}
                />
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Price Range
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-gray-700">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={10}
            value={priceRange[1]}
            onChange={e =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-black cursor-pointer"
          />
          <div className="grid grid-cols-2 gap-2">
            {[200, 500, 1000, 5000].map(p => (
              <button
                key={p}
                onClick={() => setPriceRange([0, p])}
                className={`text-xs py-2 rounded-lg border font-medium transition-all ${
                  priceRange[1] === p && priceRange[0] === 0
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                Under ${p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* On Sale Toggle */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Promotions
        </p>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              onSaleOnly ? 'bg-black' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                onSaleOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
            On Sale Only
          </span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          onReset();
          onClose?.();
        }}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors text-left font-medium"
      >
        <FiRefreshCw size={13} />
        Reset all filters
      </button>
    </aside>
  );
}

export { categories };
