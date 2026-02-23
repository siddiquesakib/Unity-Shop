// components/product/ProductCardB2B.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiShoppingCart,
  FiMessageSquare,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Default placeholder image
  const placeholderImage =
    "https://via.placeholder.com/400x400?text=Product+Image";

  // Helper to get a safe image URL
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

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden glass p-4  hover:-translate-y-1  shadow-lg "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={getSafeImageUrl()}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />

        {/* Hover Overlay with Quick Actions */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button className="p-3 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-lg">
            <FiShoppingCart className="w-5 h-5" />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="p-3 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-lg"
          >
            <FiMessageSquare className="w-5 h-5" />
          </Link>
        </div>

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-lg">
            NEW
          </span>
        )}
        {product.discount && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-gray-800 font-semibold line-clamp-2 hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price & MOQ */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              ${product.priceMin?.toFixed(2)}
            </span>
            {product.priceMax && product.priceMax > product.priceMin && (
              <span className="text-sm text-gray-500 ml-1">
                - ${product.priceMax.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-gray-500 ml-1">
              / {product.unit || "piece"}
            </span>
          </div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            MOQ: {product.moq} {product.unit || "pcs"}
          </span>
        </div>

        {/* Supplier Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {product.supplier?.avatar ? (
              <Image
                src={product.supplier.avatar}
                alt={product.supplier.name}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {product.supplier?.name?.charAt(0) || "S"}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
              {product.supplier?.name || "Supplier"}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">
              {product.supplier?.responseRate || "98"}%
            </span>
          </div>
        </div>

        {/* Location & Years */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <span className="mr-1">📍</span>
            {product.supplier?.location || "China"}
          </span>
          <span className="flex items-center">
            <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
            {product.supplier?.rating || "4.8"} ({product.reviewCount || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
