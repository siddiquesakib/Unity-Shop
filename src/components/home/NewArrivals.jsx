// components/home/NewArrivals.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { FiArrowRight, FiPackage } from "react-icons/fi";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/new-arrivals?limit=12`,
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-8 h-1 rounded-full bg-black" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                Just In
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
              New Arrivals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fresh products added to our store
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            View All <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-square" />
                <div className="mt-3 space-y-2 px-1">
                  <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            View All <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
