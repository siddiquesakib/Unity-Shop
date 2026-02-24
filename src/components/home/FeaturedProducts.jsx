// components/home/FeaturedProducts.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { FiGrid } from "react-icons/fi";

const filters = [
  { id: "recommended", label: "Recommended", sort: "recommended" },
  { id: "latest", label: "Latest", sort: "latest" },
  { id: "topRated", label: "Top Rated", sort: "top-rated" },
];

const PRODUCTS_LIMIT = 20;

const FeaturedProducts = ({
  title = "Recommended Products",
  viewAllLink = "/products",
}) => {
  const [activeFilter, setActiveFilter] = useState("recommended");
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

  // Fetch on mount and when filter changes
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
    <section className="py-10 sm:py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Top-quality products from verified suppliers
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="mt-3 sm:mt-0 inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium group"
          >
            View All Products
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeFilter === f.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-gray-400">
            <FiGrid className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-medium">{error}</p>
            <button
              onClick={() =>
                fetchProducts(
                  filters.find((f) => f.id === activeFilter)?.sort ||
                    "recommended",
                )
              }
              className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiGrid className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
