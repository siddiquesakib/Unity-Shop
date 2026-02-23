// components/home/CategoryGrid.jsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiMonitor,
  FiShoppingBag,
  FiHome,
  FiHeart,
  FiActivity,
  FiGift,
  FiTruck,
  FiBriefcase,
  FiSun,
  FiBookOpen,
  FiGrid,
} from "react-icons/fi";

// Map category IDs to icons and colors
const categoryMeta = {
  electronics: {
    icon: FiMonitor,
    color: "from-blue-500 to-cyan-500",
  },
  fashion: {
    icon: FiShoppingBag,
    color: "from-pink-500 to-rose-500",
  },
  living: {
    icon: FiHome,
    color: "from-green-500 to-emerald-500",
  },
  kitchen: {
    icon: FiHeart,
    color: "from-purple-500 to-violet-500",
  },
  bedroom: {
    icon: FiGift,
    color: "from-orange-500 to-amber-500",
  },
  lighting: {
    icon: FiSun,
    color: "from-yellow-500 to-amber-500",
  },
  stationery: {
    icon: FiBriefcase,
    color: "from-gray-500 to-slate-500",
  },
  outdoor: {
    icon: FiActivity,
    color: "from-teal-500 to-cyan-500",
  },
  office: {
    icon: FiBriefcase,
    color: "from-indigo-500 to-purple-500",
  },
};

// Pretty labels for category IDs
const categoryLabels = {
  electronics: "Electronics",
  fashion: "Fashion",
  living: "Home & Living",
  kitchen: "Kitchen",
  bedroom: "Bedroom",
  lighting: "Lighting",
  stationery: "Stationery",
  outdoor: "Outdoor",
  office: "Office",
};

const defaultMeta = {
  icon: FiGrid,
  color: "from-gray-400 to-gray-600",
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
        );
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Browse our collections
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="h-3 bg-gray-200 rounded w-14" />
                  <div className="h-2.5 bg-gray-200 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No categories available yet</p>
          </div>
        ) : (
          /* Category Grid */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.map((category) => {
              const meta = categoryMeta[category.name] || defaultMeta;
              const Icon = meta.icon;
              const label = categoryLabels[category.name] || category.name;
              return (
                <Link
                  key={category.name}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group bg-gray-50 hover:bg-white rounded-xl p-3 sm:p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${meta.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                      {label}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {category.count}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
