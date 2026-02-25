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
  FiSmartphone,
  FiHeadphones,
  FiWatch,
  FiCamera,
  FiCpu,
  FiDroplet,
  FiFeather,
  FiTool,
  FiBox,
  FiCoffee,
} from "react-icons/fi";

// Map category IDs to icons
const categoryMeta = {
  electronics: { icon: FiMonitor },
  fashion: { icon: FiShoppingBag },
  living: { icon: FiHome },
  kitchen: { icon: FiCoffee },
  bedroom: { icon: FiGift },
  lighting: { icon: FiSun },
  stationery: { icon: FiBriefcase },
  outdoor: { icon: FiActivity },
  office: { icon: FiBriefcase },
  mobile: { icon: FiSmartphone },
  audio: { icon: FiHeadphones },
  watches: { icon: FiWatch },
  cameras: { icon: FiCamera },
  gaming: { icon: FiCpu },
  beauty: { icon: FiDroplet },
  sports: { icon: FiActivity },
  books: { icon: FiBookOpen },
  toys: { icon: FiBox },
  tools: { icon: FiTool },
  grocery: { icon: FiFeather },
  automotive: { icon: FiTruck },
  health: { icon: FiHeart },
};

// All categories to always display
const allCategories = [
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "living", label: "Home & Living" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bedroom", label: "Bedroom" },
  { id: "office", label: "Office" },
  { id: "mobile", label: "Mobiles" },
  { id: "watches", label: "Watches" },
  { id: "audio", label: "Audio" },
  { id: "cameras", label: "Cameras" },
  { id: "gaming", label: "Gaming" },
  { id: "lighting", label: "Lighting" },
  { id: "beauty", label: "Beauty" },
  { id: "health", label: "Health" },
  { id: "sports", label: "Sports" },
  { id: "outdoor", label: "Outdoor" },
  { id: "books", label: "Books" },
  { id: "stationery", label: "Stationery" },
  { id: "toys", label: "Toys & Baby" },
  { id: "grocery", label: "Grocery" },
  { id: "tools", label: "Tools" },
  { id: "automotive", label: "Automotive" },
];

const defaultMeta = { icon: FiGrid };

const CategoryGrid = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
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
          // Build a map: { living: 5, kitchen: 5, ... }
          const counts = {};
          data.forEach((c) => {
            counts[c.name] = c.count;
          });
          setCategoryCounts(counts);
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
  }, [categoryCounts]);

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
              <span className="inline-block w-8 h-1 rounded-full bg-black"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                Categories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Explore products across our curated collections
            </p>
          </div>

          {/* Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-black hover:text-white hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-black hover:text-white hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-3">
            {[...Array(22)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 animate-pulse border border-gray-100"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="h-3 bg-gray-200 rounded-full w-14" />
                  <div className="h-2.5 bg-gray-100 rounded-full w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-gray-50/80 to-transparent z-10 pointer-events-none sm:hidden" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-gray-50/80 to-transparent z-10 pointer-events-none sm:hidden" />
            )}

            <div
              ref={scrollRef}
              className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-3 overflow-x-auto sm:overflow-visible scrollbar-hide pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
            >
              {allCategories.map((cat, index) => {
                const meta = categoryMeta[cat.id] || defaultMeta;
                const Icon = meta.icon;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="group relative shrink-0 w-28 sm:w-auto snap-start"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="relative bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-black hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 ease-out overflow-hidden h-full">
                      <div className="relative flex flex-col items-center text-center space-y-1.5">
                        {/* Icon Container */}
                        <div
                          className={`relative w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-all duration-300 ease-out ${
                            count > 0
                              ? "bg-gray-100 ring-gray-200 group-hover:ring-2 group-hover:ring-black group-hover:bg-black group-hover:scale-110"
                              : "bg-gray-50 ring-gray-100 group-hover:ring-gray-300 group-hover:scale-105"
                          }`}
                        >
                          <Icon
                            className={`w-4.5 h-4.5 transition-all duration-300 ${
                              count > 0
                                ? "text-gray-700 group-hover:text-white"
                                : "text-gray-300 group-hover:text-gray-500"
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <h3
                          className={`text-[11px] sm:text-xs font-semibold transition-colors duration-200 leading-tight ${
                            count > 0
                              ? "text-gray-800 group-hover:text-black"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        >
                          {cat.label}
                        </h3>

                        {/* Product count */}
                        <span
                          className={`text-[10px] font-medium transition-colors duration-200 ${
                            count > 0
                              ? "text-gray-400 group-hover:text-black"
                              : "text-gray-300"
                          }`}
                        >
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </div>

                      {/* Bottom accent line on hover */}
                      {count > 0 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-8 bg-black transition-all duration-300 rounded-full" />
                      )}
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
