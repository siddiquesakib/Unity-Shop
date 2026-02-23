// components/product/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiEye, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const placeholderImage =
    "https://via.placeholder.com/400x400?text=Product+Image";

  const getSafeImageUrl = () => {
    if (imageError) return placeholderImage;
    let url = placeholderImage;
    if (Array.isArray(product.image)) {
      if (
        typeof product.image[0] === "string" &&
        product.image[0].trim() !== ""
      ) {
        url = product.image[0];
      }
    } else if (
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      url = product.image;
    }
    try {
      if (url.startsWith("/")) return url;
      new URL(url);
      return url;
    } catch {
      return placeholderImage;
    }
  };

  // Support both _id (MongoDB) and id
  const productId = product._id || product.id;

  // Calculate discount percentage
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={getSafeImageUrl()}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button className="p-2.5 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-md">
            <FiShoppingCart className="w-4 h-4" />
          </button>
          <Link
            href={`/products/${productId}`}
            className="p-2.5 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-md"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>

        {/* Badges */}
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-semibold rounded-full shadow">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-linear-to-r from-orange-500 to-red-500 text-white text-[10px] font-semibold rounded-full shadow">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Product Title */}
        <Link href={`/products/${productId}`} className="block">
          <h3 className="text-sm text-gray-800 font-medium line-clamp-2 hover:text-orange-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-600">
              {product.rating || 0}
            </span>
            <span className="text-[11px] text-gray-400">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[8px] font-bold">
              {product.sellerName?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <span className="text-[11px] text-gray-400 truncate max-w-17.5">
              {product.sellerName || "UnityShop"}
            </span>
          </div>
        </div>

        {/* Category */}
        {product.category && (
          <span className="inline-block text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full capitalize">
            {product.category}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
