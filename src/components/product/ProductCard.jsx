// components/product/ProductCard.jsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useState, useCallback } from "react";
import {
  FiShoppingCart,
  FiEye,
  FiStar,
  FiCheck,
  FiX,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";

const getProductImages = (product) => {
  const multi = Array.isArray(product?.images) ? product.images : [];
  const legacy = Array.isArray(product?.image)
    ? product.image
    : typeof product?.image === "string"
      ? [product.image]
      : [];

  return [...new Set([...multi, ...legacy])].filter(
    (img) => typeof img === "string" && img.trim(),
  );
};

/* ━━━━━ QuickView Modal ━━━━━ */
function QuickViewModal({ product, onClose, formatPrice }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(product.moq || 1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addToCart } = useCart();

  const images = getProductImages(product);

  const safeImg = (url) => {
    if (!url) return "https://via.placeholder.com/600x600?text=No+Image";
    try {
      if (url.startsWith("/")) return url;
      new URL(url);
      return url;
    } catch {
      return "https://via.placeholder.com/600x600?text=No+Image";
    }
  };

  const prevImg = () =>
    setImgIdx((p) => (p - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((p) => (p + 1) % images.length);

  const handleAdd = () => {
    if (addedFeedback) return;
    addToCart(product, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  const productId = product._id || product.id;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 animate-[fadeUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
        >
          <FiX size={16} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image Gallery */}
          <div className="relative w-full md:w-1/2 aspect-square bg-gray-50 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            {images.length > 0 ? (
              <>
                <Image
                  src={safeImg(images[imgIdx])}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 shadow-sm transition-colors"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 shadow-sm transition-colors"
                    >
                      <FiChevronRight size={16} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === imgIdx ? "bg-black" : "bg-black/25"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                No Image
              </div>
            )}

            {discount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-black leading-snug pr-8">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-xl sm:text-2xl font-black text-black">
                {formatPrice(product.price, product.currency || "USD")}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(
                      product.originalPrice,
                      product.currency || "USD",
                    )}
                  </span>
                )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.rating || 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-500 mt-4 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Category / Tags */}
            <div className="mt-4 space-y-1.5 text-xs text-gray-400">
              {product.category && (
                <p>
                  <span className="font-semibold text-gray-600">Category:</span>{" "}
                  {product.category}
                </p>
              )}
              {product.brand && (
                <p>
                  <span className="font-semibold text-gray-600">Brand:</span>{" "}
                  {product.brand}
                </p>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-auto pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setQty((q) => Math.max(product.moq || 1, q - 1))
                    }
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center text-sm font-bold text-black border-x border-gray-200">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <Button
                  onClick={handleAdd}
                  disabled={addedFeedback}
                  showIcon={false}
                  className="flex-1 !h-10 !py-0 flex items-center justify-center gap-2"
                >
                  {addedFeedback ? (
                    <>
                      <FiCheck size={16} /> Added
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={16} /> Add to Cart
                    </>
                  )}
                </Button>
              </div>

              <Link
                href={`/products/${productId}`}
                onClick={onClose}
                className="w-full h-10 rounded-lg border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 transition-colors"
              >
                <FiExternalLink size={14} /> View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

/* ━━━━━ ProductCard ━━━━━ */
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const { addToCart } = useCart();

  const placeholderImage =
    "https://via.placeholder.com/400x400?text=Product+Image";
  const productImages = getProductImages(product);

  const getSafeImageUrl = (index = 0) => {
    if (imageError && index === 0) return placeholderImage;
    let url = null;
    if (Array.isArray(productImages)) {
      if (
        typeof productImages[index] === "string" &&
        productImages[index].trim() !== ""
      ) {
        url = productImages[index];
      }
    }
    if (!url) return index === 0 ? placeholderImage : null;
    try {
      if (url.startsWith("/")) return url;
      new URL(url);
      return url;
    } catch {
      return index === 0 ? placeholderImage : null;
    }
  };

  const primaryImage = getSafeImageUrl(0);
  const secondImage = getSafeImageUrl(1);

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
    e.stopPropagation();
    if (addedFeedback) return;
    addToCart(product, product.moq || 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Link
        href={`/products/${productId}`}
        className="group relative bg-white/40 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/60 hover:border-white/40 hover:-translate-y-0.5 block shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-transparent">
          {/* Primary image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            unoptimized={true}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out ${secondImage ? (isHovered ? "opacity-0 scale-105" : "opacity-100") : "group-hover:scale-105"}`}
            onError={() => setImageError(true)}
          />

          {/* Second image (shown on hover) */}
          {secondImage && (
            <Image
              src={secondImage}
              alt={`${product.name} - 2`}
              fill
              unoptimized={true}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 ease-out ${isHovered ? "opacity-100 scale-105" : "opacity-0"}`}
            />
          )}

          {/* Desktop hover — 3 action buttons (right side, vertical) */}
          <div
            className={`absolute top-2.5 right-2.5 flex-col gap-1.5 transition-all duration-200 hidden lg:flex ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              title="Add to Cart"
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                addedFeedback
                  ? "bg-black text-white scale-110"
                  : "bg-white hover:bg-black hover:text-white text-gray-700"
              }`}
            >
              {addedFeedback ? (
                <FiCheck size={14} />
              ) : (
                <FiShoppingCart size={14} />
              )}
            </button>

            {/* Quick View */}
            <button
              onClick={handleQuickView}
              title="Quick View"
              className="w-8 h-8 rounded-full bg-white hover:bg-black hover:text-white text-gray-700 flex items-center justify-center shadow-md transition-all duration-200"
            >
              <FiEye size={14} />
            </button>

            {/* View Details */}
            <span
              title="View Details"
              className="w-8 h-8 rounded-full bg-white hover:bg-black hover:text-white text-gray-700 flex items-center justify-center shadow-md transition-all duration-200"
              aria-hidden="true"
            >
              <FiExternalLink size={14} />
            </span>
          </div>

          {/* Mobile: small quick-add + quick-view row */}
          <div className="absolute bottom-2 right-2 flex gap-1.5 lg:hidden">
            <button
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white text-gray-700 border border-gray-200 flex items-center justify-center shadow-sm"
            >
              <FiEye size={14} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                addedFeedback
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-200"
              }`}
            >
              {addedFeedback ? (
                <FiCheck size={14} />
              ) : (
                <FiShoppingCart size={14} />
              )}
            </button>
          </div>

          {/* Discount badge */}
          {discount && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full tracking-wide">
              -{discount}%
            </span>
          )}

          {/* Badge */}
          {product.badge && !discount && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-full tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 line-clamp-2 sm:line-clamp-1 group-hover:text-black transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                    i < Math.round(product.rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs text-gray-400 ml-0.5">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-[15px] sm:text-base font-black text-black">
              {formatPrice(product.price, product.currency || "USD")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice, product.currency || "USD")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
          formatPrice={formatPrice}
        />
      )}
    </>
  );
};

export default ProductCard;
