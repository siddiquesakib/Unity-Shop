// components/home/CategoryGrid.jsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// Map category IDs to icons, gradient colors, and soft bg colors
const categoryMeta = {
  electronics: {
    icon: FiMonitor,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    ring: "ring-blue-200",
  },
  fashion: {
    icon: FiShoppingBag,
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
    ring: "ring-pink-200",
  },
  living: {
    icon: FiHome,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ring: "ring-emerald-200",
  },
  kitchen: {
    icon: FiHeart,
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    ring: "ring-purple-200",
  },
  bedroom: {
    icon: FiGift,
    gradient: "from-orange-400 to-amber-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    ring: "ring-orange-200",
  },
  lighting: {
    icon: FiSun,
    gradient: "from-yellow-400 to-orange-500",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    ring: "ring-yellow-200",
  },
  stationery: {
    icon: FiBriefcase,
    gradient: "from-slate-500 to-gray-600",
    bg: "bg-slate-50",
    iconColor: "text-slate-600",
    ring: "ring-slate-200",
  },
  outdoor: {
    icon: FiActivity,
    gradient: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
    ring: "ring-teal-200",
  },
  office: {
    icon: FiBriefcase,
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    ring: "ring-indigo-200",
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
  gradient: "from-gray-400 to-gray-600",
  bg: "bg-gray-50",
  iconColor: "text-gray-600",
  ring: "ring-gray-200",
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-linear-to-b from-gray-50/80 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-8 h-1 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Categories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Explore products across our curated collections
            </p>
          </div>

          {/* Scroll Arrows (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded-full w-20" />
                  <div className="h-3 bg-gray-100 rounded-full w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiGrid className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No categories available yet</p>
          </div>
        ) : (
          /* Category Scrollable Row */
          <div className="relative">
            {/* Left fade */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-gray-50/80 to-transparent z-10 pointer-events-none sm:hidden" />
            )}
            {/* Right fade */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-gray-50/80 to-transparent z-10 pointer-events-none sm:hidden" />
            )}

            <div
              ref={scrollRef}
              className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible scrollbar-hide pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
            >
              {categories.map((category, index) => {
                const meta = categoryMeta[category.name] || defaultMeta;
                const Icon = meta.icon;
                const label = categoryLabels[category.name] || category.name;
                return (
                  <Link
                    key={category.name}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group relative shrink-0 w-35 sm:w-auto snap-start"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 ease-out overflow-hidden h-full">
                      {/* Hover gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`}
                      />

                      <div className="relative flex flex-col items-center text-center space-y-3">
                        {/* Icon Container */}
                        <div
                          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${meta.bg} flex items-center justify-center ring-1 ${meta.ring} group-hover:ring-2 group-hover:scale-110 transition-all duration-300 ease-out`}
                        >
                          <Icon
                            className={`w-6 h-6 sm:w-7 sm:h-7 ${meta.iconColor} transition-transform duration-300 group-hover:scale-110`}
                          />
                        </div>

                        {/* Label */}
                        <h3 className="text-sm sm:text-[15px] font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 leading-tight">
                          {label}
                        </h3>

                        {/* Product count badge */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                          {category.count}{" "}
                          {category.count === 1 ? "product" : "products"}
                        </span>
                      </div>

                      {/* Bottom accent line on hover */}
                      <div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 bg-linear-to-r ${meta.gradient} transition-all duration-300 rounded-full`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default CategoryGrid;
