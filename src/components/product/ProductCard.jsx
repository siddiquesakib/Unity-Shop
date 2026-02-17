// src/components/product/ProductCard.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const badgeStyles = {
  Sale: "bg-rose-100 text-rose-700",
  New: "bg-emerald-100 text-emerald-700",
  "Best Seller": "bg-amber-100 text-amber-800",
  Trending: "bg-violet-100 text-violet-700",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? "text-amber-500" : "text-stone-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, view = "grid" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
    // TODO: connect to CartContext → addToCart(product)
  };

  // ── List View ─────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="group flex gap-6 bg-white rounded-2xl border border-stone-200/70 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-500 p-4">
        <div className="relative w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="144px"
          />
          {product.badge && (
            <span
              className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyles[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <h3 className="font-display text-xl font-light text-stone-900 group-hover:text-amber-800 transition-colors">
              {product.name}
            </h3>
            <p className="font-body text-stone-500 text-sm mt-1">
              {product.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-stone-400">
                ({product.reviews})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-light text-stone-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/products/${product.id}`}
                className="px-5 py-2.5 rounded-full text-sm font-medium tracking-wide border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-all duration-200"
              >
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-900 text-white hover:bg-amber-800"
                }`}
              >
                {addedToCart ? "✓ Added" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid View (default) ───────────────────────────────────────────────────
  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/70 overflow-hidden hover:shadow-2xl hover:border-stone-300 transition-all duration-500">
      {/* Wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-all duration-200"
        aria-label="Add to wishlist"
      >
        <svg
          className={`w-4 h-4 transition-colors ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-stone-400"}`}
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        {/* Hover overlay + CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            className={`px-8 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-xl transition-all duration-300 ${
              addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-white text-stone-900 hover:bg-amber-800 hover:text-white"
            }`}
          >
            {addedToCart ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-lg font-light text-stone-900 group-hover:text-amber-800 transition-colors leading-tight hover:underline underline-offset-2">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-stone-500 text-sm mt-1 truncate">
          {product.description}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-stone-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-light text-stone-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <span className="text-xs text-rose-600 font-medium">
              Save ${product.originalPrice - product.price}
            </span>
          )}
        </div>
        <Link
          href={`/products/${product.id}`}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:border-stone-900 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200"
        >
          View Details
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
