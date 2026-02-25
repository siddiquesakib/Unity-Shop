// components/product/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiEye, FiStar, FiCheck } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addToCart } = useCart();

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

  const productId = product._id || product.id;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (addedFeedback) return;
    addToCart(product, product.moq || 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={getSafeImageUrl()}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={() => setImageError(true)}
        />

        {/* Hover overlay — B&W */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleAddToCart}
            title="Add to cart"
            className={`p-3 rounded-full transition-all duration-200 ${
              addedFeedback
                ? "bg-white text-gray-900 scale-110"
                : "bg-white/90 hover:bg-white text-gray-900 hover:scale-110"
            }`}
          >
            {addedFeedback ? (
              <FiCheck className="w-4.5 h-4.5" />
            ) : (
              <FiShoppingCart className="w-4.5 h-4.5" />
            )}
          </button>
          <Link
            href={`/products/${productId}`}
            title="View details"
            className="p-3 bg-white/90 rounded-full hover:bg-white text-gray-900 hover:scale-110 transition-all duration-200"
          >
            <FiEye className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* Discount badge — top right */}
        {discount && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Link href={`/products/${productId}`} className="block">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:underline decoration-gray-300 underline-offset-2 transition-all leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(product.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-0.5">
            {product.rating || 0}
            <span className="text-gray-300">/{product.reviews || 0}</span>
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
