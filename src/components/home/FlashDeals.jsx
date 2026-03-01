"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import {
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

const FlashDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/flash-deals?limit=10`,
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch flash deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const pad = (n) => String(n).padStart(2, "0");

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                <FiZap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
                Flash Deals
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Limited time offers — grab them before they&apos;re gone!
            </p>
          </div>

          {/* Countdown + Scroll arrows */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            {/* Countdown */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap">
              <span className="text-xs text-gray-500 font-medium hidden xs:inline">
                Ends in
              </span>
              <span className="text-xs text-gray-500 font-medium xs:hidden">
                Ends:
              </span>
              {[
                { val: pad(timeLeft.hours), label: "h" },
                { val: pad(timeLeft.minutes), label: "m" },
                { val: pad(timeLeft.seconds), label: "s" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="bg-black text-white text-xs sm:text-sm font-mono font-bold px-1.5 sm:px-2 py-1 rounded-md min-w-7 sm:min-w-8 text-center">
                    {t.val}
                  </div>
                  {i < 2 && (
                    <span className="text-gray-400 font-bold text-xs">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* Scroll arrows (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-full border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-full border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products scroll */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-36 xs:w-40 sm:w-48 animate-pulse"
              >
                <div className="bg-gray-100 rounded-xl aspect-square" />
                <div className="mt-3 space-y-2 px-1">
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-50 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="shrink-0 w-36 xs:w-40 sm:w-48 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        {products.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Deals <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashDeals;
