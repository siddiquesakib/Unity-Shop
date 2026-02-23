// components/home/CategoryGrid.jsx
"use client";

import Link from "next/link";
import {
  FiMonitor,
  FiShoppingBag,
  FiHome,
  FiHeart,
  FiActivity,
  FiGift,
  FiTruck,
  FiBriefcase,
} from "react-icons/fi";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: FiMonitor,
    color: "from-blue-500 to-cyan-500",
    href: "/categories/electronics",
    count: "12.5k+",
  },
  {
    id: 2,
    name: "Fashion",
    icon: FiShoppingBag,
    color: "from-pink-500 to-rose-500",
    href: "/categories/fashion",
    count: "8.2k+",
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: FiHome,
    color: "from-green-500 to-emerald-500",
    href: "/categories/home-garden",
    count: "5.3k+",
  },
  {
    id: 4,
    name: "Health & Beauty",
    icon: FiHeart,
    color: "from-purple-500 to-violet-500",
    href: "/categories/health-beauty",
    count: "4.1k+",
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    icon: FiActivity,
    color: "from-orange-500 to-amber-500",
    href: "/categories/sports-outdoors",
    count: "3.7k+",
  },
  {
    id: 6,
    name: "Toys & Kids",
    icon: FiGift,
    color: "from-yellow-500 to-amber-500",
    href: "/categories/toys-kids",
    count: "2.9k+",
  },
  {
    id: 7,
    name: "Automotive",
    icon: FiTruck,
    color: "from-red-500 to-rose-500",
    href: "/categories/automotive",
    count: "2.4k+",
  },
  {
    id: 8,
    name: "Office Supplies",
    icon: FiBriefcase,
    color: "from-gray-500 to-slate-500",
    href: "/categories/office-supplies",
    count: "1.8k+",
  },
  {
    id: 9,
    name: "Gadgets",
    icon: FiMonitor,
    color: "from-indigo-500 to-purple-500",
    href: "/categories/gadgets",
    count: "1.2k+",
  },
  {
    id: 10,
    name: "Apparel",
    icon: FiShoppingBag,
    color: "from-teal-500 to-cyan-500",
    href: "/categories/apparel",
    count: "9.8k+",
  },
  {    id: 11,
    name: "Furniture",
    icon: FiHome,
    color: "from-amber-500 to-orange-500",
    href: "/categories/furniture",
    count: "7.4k+",
  },
  {    id: 12,
    name: "Beauty Products",
    icon: FiHeart,
    color: "from-pink-500 to-rose-500",
    href: "/categories/beauty-products",
    count: "4.2k+",
  },
  {    id: 13,
    name: "Fitness Equipment",
    icon: FiActivity,
    color: "from-green-500 to-emerald-500",
    href: "/categories/fitness-equipment",
    count: "3.1k+",
  },
  {    id: 14,
    name: "Kids' Toys",
    icon: FiGift,
    color: "from-yellow-500 to-amber-500",
    href: "/categories/kids-toys",
    count: "2.3k+",
  },
  {    id: 15,
    name: "Car Accessories",
    icon: FiTruck,
    color: "from-red-500 to-rose-500",
    href: "/categories/car-accessories",
    count: "1.9k+",
  },
    {    id: 16,
    name: "More Categories",
    icon: FiActivity,
    color: "from-gray-400 to-gray-600",
    href: "/categories",
    count: "100+",
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse millions of products across thousands of categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 glass p-6 rounded-2xl border border-gray-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon with gradient background */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Category Name */}
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  {/* Product Count */}
                  <p className="text-sm text-gray-500">
                    {category.count} products
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
