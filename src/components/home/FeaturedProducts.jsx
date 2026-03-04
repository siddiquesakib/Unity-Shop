// components/home/FeaturedProducts.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { FiGrid, FiArrowRight } from "react-icons/fi";

const filters = [
  { id: "recommended", label: "Recommended", sort: "recommended" },
  { id: "latest", label: "New Arrivals", sort: "latest" },
  { id: "topRated", label: "Top Rated", sort: "top-rated" },
];

const PRODUCTS_LIMIT = 20;

const FeaturedProducts = ({
  title = "NEW ARRIVALS",
  viewAllLink = "/products",
}) => {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (sort) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/recommended?sort=${sort}&limit=${PRODUCTS_LIMIT}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch recommended products:", err);
      setError("Could not load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentSort =
      filters.find((f) => f.id === activeFilter)?.sort || "recommended";
    fetchProducts(currentSort);
  }, [activeFilter, fetchProducts]);

  const handleFilterChange = (filterId) => {
    if (filterId === activeFilter) return;
    setActiveFilter(filterId);
  };

  return (
    <section className="py-16 sm:py-20 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl m-4 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
            {title}
          </h2>
          <div className="w-16 h-1 bg-black mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Tabs — centered, minimal */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`relative px-4 sm:px-5 py-3 text-base sm:text-sm font-medium transition-all duration-200 ${
                activeFilter === f.id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f.label}
              {/* Active underline */}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-black rounded-full transition-all duration-300 ${
                  activeFilter === f.id ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-xl aspect-square" />
                <div className="mt-4 space-y-2.5 px-1">
                  <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3.5 bg-gray-50 rounded-full w-1/2" />
                  <div className="h-3 bg-gray-50 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <FiGrid className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <p className="text-base text-gray-400 font-medium">{error}</p>
            <button
              onClick={() =>
                fetchProducts(
                  filters.find((f) => f.id === activeFilter)?.sort ||
                    "recommended",
                )
              }
              className="mt-4 text-sm text-black hover:underline font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <FiGrid className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <p className="text-lg text-gray-400 font-medium">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2.5 px-10 py-4 text-sm font-bold text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
            >
              View All
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
