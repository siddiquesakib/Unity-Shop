// components/product/ProductCard.jsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiEye, FiStar, FiCheck } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

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
    <Link
      href={`/products/${productId}`}
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/80 hover:border-gray-200 block"
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
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setImageError(true)}
        />

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleAddToCart}
            title="Add to cart"
            className={`p-3 rounded-full transition-all duration-200 shadow-sm ${
              addedFeedback
                ? "bg-white text-black scale-110"
                : "bg-white/90 hover:bg-white text-gray-900 hover:scale-110"
            }`}
          >
            {addedFeedback ? (
              <FiCheck className="w-4 h-4" />
            ) : (
              <FiShoppingCart className="w-4 h-4" />
            )}
          </button>
          <Link
            href={`/products/${productId}`}
            title={t("viewDetails")} // 👈 translated
            className="p-3 bg-white/90 rounded-full hover:bg-white text-gray-900 hover:scale-110 transition-all duration-200"
          >
            <FiEye className="w-4 h-4" />
          </span>
        </div>

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-black text-white text-[10px] font-bold rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-black transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(product.rating || 0)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-0.5">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-black text-gray-900">
            {formatPrice(product.price, product.currency || "USD")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice, product.currency || "USD")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
