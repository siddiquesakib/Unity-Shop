"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";

/* ━━━━━ Category Data ━━━━━ */
const categories = [
  {
    id: "Fashion",
    label: "Fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Electronics",
    label: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Home & Living",
    label: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Beauty",
    label: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Watches",
    label: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Toys & Baby",
    label: "Gifts",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238f7e1?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Mobiles",
    label: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Gaming",
    label: "Gaming",
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Sports",
    label: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Books",
    label: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Grocery",
    label: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=700&fit=crop&q=80",
  },
  {
    id: "Health",
    label: "Health",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=700&fit=crop&q=80",
  },
];

/* ━━━━━ Single Category Card ━━━━━ */
const CategoryCard = ({ cat, count }) => (
  <Link
    href={`/products?category=${encodeURIComponent(cat.id)}`}
    className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/5] block"
  >
    {/* Image */}
    <Image
      src={cat.image}
      alt={cat.label}
      fill
      sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 16vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />

    {/* Gradient overlay — always visible, stronger at bottom */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

    {/* Hover tint */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

    {/* Label at bottom */}
    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
      <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-sm leading-tight">
        {cat.label}
      </h3>
      {count > 0 && (
        <p className="text-[11px] text-white/70 mt-0.5 font-medium">
          {count}+ items
        </p>
      )}
    </div>

    {/* Arrow icon — appears on hover */}
    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
      <FiArrowRight className="w-4 h-4 text-black" />
    </div>
  </Link>
);

/* ━━━━━ Main Component ━━━━━ */
const CategoryGrid = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
        );
        if (res.ok) {
          const data = await res.json();
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

  return (
    <section className="py-10 sm:py-14 bg-[#f7f6f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Discover our curated collections
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {/* ── Loading Skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ── Desktop Grid (2 rows of 6) ── */}
            <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  count={categoryCounts[cat.id] || 0}
                />
              ))}
            </div>

            {/* ── Mobile Horizontal Scroll ── */}
            <div className="sm:hidden relative -mx-4">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="group relative shrink-0 w-32 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 snap-start"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-sm font-bold text-white drop-shadow-sm leading-tight">
                        {cat.label}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile "see all" link */}
            <div className="sm:hidden mt-5 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                View All Categories <FiArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
