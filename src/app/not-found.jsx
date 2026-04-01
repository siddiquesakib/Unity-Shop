"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiHome, FiShoppingBag, FiArrowRight } from "react-icons/fi";

export default function GlobalNotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfbf7] px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-9xl md:text-[150px] font-black text-gray-100 tracking-tighter select-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 bg-white/50 px-4 py-1 backdrop-blur-sm rounded-lg">
              Page Not Found
            </h2>
          </div>
        </div>

        <p className="text-gray-500 max-w-md mx-auto text-base">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-3 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <FiArrowRight size={20} />
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
          >
            <FiHome size={18} />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-black border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <FiShoppingBag size={18} />
            Shop Now
          </Link>
        </div>

        {/* Categories */}
        <div className="pt-10 border-t border-gray-200 mt-10">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Popular Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Electronics", "Fashion", "Home & Living", "Beauty"].map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm hover:border-black hover:text-black transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}