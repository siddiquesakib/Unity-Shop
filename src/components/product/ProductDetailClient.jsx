// components/product/ProductDetailClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus,
  FiStar,
  FiPackage,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronRight,
  FiShare2,
  FiCheck,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";

const ProductDetailClient = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();
  const router = useRouter();

  const placeholderImage =
    "https://via.placeholder.com/800x800?text=Product+Image";

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
      if (url.startsWith("/") || url.startsWith("data:")) return url;
      new URL(url);
      return url;
    } catch {
      return placeholderImage;
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    const maxStock = product.stock || 999;
    if (newQty >= 1 && newQty <= maxStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  const rating = Math.round(product.rating || 0);

  return (
    <div className="space-y-10">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-stone-400">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <FiChevronRight size={12} />
        <Link href="/products" className="hover:text-black transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <FiChevronRight size={12} />
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-black transition-colors capitalize"
            >
              {product.category}
            </Link>
          </>
        )}
        <FiChevronRight size={12} />
        <span className="text-stone-900 font-medium truncate max-w-64">
          {product.name}
        </span>
      </nav>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* ── Left: Image ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl border border-stone-200 overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={getSafeImageUrl()}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount && (
                  <span className="px-3 py-1.5 bg-black text-white text-xs font-bold tracking-wide rounded-full">
                    -{discount}%
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1.5 bg-white text-black text-xs font-bold tracking-wide rounded-full border border-stone-200 shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Share + Wishlist floating */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isWishlisted
                      ? "bg-black text-white"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-black hover:text-white hover:border-black"
                  }`}
                >
                  <FiHeart
                    size={16}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-black hover:text-white hover:border-black shadow-sm transition-all"
                >
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Image thumbnails for multiple images */}
          {Array.isArray(product.image) && product.image.length > 1 && (
            <div className="flex gap-3">
              {product.image.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl border-2 border-stone-200 bg-white overflow-hidden cursor-pointer hover:border-black transition-colors"
                >
                  <Image
                    src={img}
                    alt=""
                    width={80}
                    height={80}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ──────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          {/* Category + Brand */}
          <div className="flex items-center gap-3 flex-wrap">
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold tracking-widest uppercase text-stone-400 hover:text-black transition-colors"
              >
                {product.category}
              </Link>
            )}
            {product.category && product.brand && (
              <span className="w-1 h-1 rounded-full bg-stone-300" />
            )}
            {product.brand && (
              <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                {product.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={16}
                  className={
                    star <= rating ? "text-black fill-black" : "text-stone-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-medium text-black">
              {product.rating || 0}
            </span>
            <span className="text-sm text-stone-400">
              ({product.reviews || 0} reviews)
            </span>
          </div>

          {/* Price Block */}
          <div className="py-5 border-y border-stone-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-black">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-lg text-stone-400 line-through font-medium">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
              {discount && (
                <span className="px-2.5 py-1 bg-stone-100 text-black text-xs font-bold rounded-full">
                  SAVE {discount}%
                </span>
              )}
            </div>
            {discount && (
              <p className="text-sm text-stone-500 mt-1.5">
                You save{" "}
                <span className="font-semibold text-black">
                  ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </p>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 10
                    ? "bg-black"
                    : product.stock > 0
                      ? "bg-stone-400"
                      : "bg-stone-300"
                }`}
              />
              <span className="text-sm font-medium text-stone-700">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"}
              </span>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-400 block mb-3">
              Quantity
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.stock || 999, Number(e.target.value)),
                      ),
                    )
                  }
                  className="w-14 text-center text-sm font-bold text-black border-x border-stone-200 h-11 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={1}
                  max={product.stock || 999}
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 999)}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Total */}
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Total</span>
                <span className="text-lg font-black text-black">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addedFeedback}
              className="flex-1 h-13 bg-black text-white font-bold text-sm tracking-wide uppercase rounded-full hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {addedFeedback ? (
                <>
                  <FiCheck size={18} />
                  Added! Redirecting...
                </>
              ) : (
                <>
                  <FiShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-13 h-13 rounded-full border-2 flex items-center justify-center transition-all ${
                isWishlisted
                  ? "bg-black border-black text-white"
                  : "border-stone-200 text-stone-600 hover:border-black hover:text-black"
              }`}
            >
              <FiHeart
                size={18}
                className={isWishlisted ? "fill-current" : ""}
              />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200">
            {[
              { icon: FiTruck, label: "Free Shipping", sub: "Orders $50+" },
              {
                icon: FiShield,
                label: "Secure Payment",
                sub: "100% Protected",
              },
              {
                icon: FiRefreshCw,
                label: "Easy Returns",
                sub: "30-Day Policy",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center py-3">
                <Icon size={20} className="mx-auto mb-2 text-black" />
                <p className="text-xs font-semibold text-black">{label}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Seller */}
          {product.sellerName && (
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                  {product.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {product.sellerName}
                  </p>
                  <p className="text-xs text-stone-400">Seller on UnityShop</p>
                </div>
                <Link
                  href={`/products?seller=${encodeURIComponent(product.sellerEmail || "")}`}
                  className="ml-auto text-xs font-semibold text-stone-500 hover:text-black underline underline-offset-2 transition-colors"
                >
                  View Store
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs Section ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-stone-200">
          {[
            { id: "description", label: "Description" },
            { id: "details", label: "Details" },
            ...(product.tags?.length ? [{ id: "tags", label: "Tags" }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold tracking-wide uppercase transition-colors relative ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "description" && product.description && (
            <p className="text-stone-600 leading-relaxed whitespace-pre-line max-w-3xl">
              {product.description}
            </p>
          )}

          {activeTab === "details" && (
            <div className="max-w-lg space-y-0">
              {[
                product.brand && { label: "Brand", value: product.brand },
                product.category && {
                  label: "Category",
                  value: product.category,
                },
                product.stock !== undefined && {
                  label: "Stock",
                  value: `${product.stock} units`,
                },
                product.rating && {
                  label: "Rating",
                  value: `${product.rating} / 5`,
                },
                product.reviews && {
                  label: "Reviews",
                  value: `${product.reviews}`,
                },
              ]
                .filter(Boolean)
                .map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`flex justify-between py-3 ${
                      i > 0 ? "border-t border-stone-100" : ""
                    }`}
                  >
                    <span className="text-sm text-stone-400 font-medium">
                      {label}
                    </span>
                    <span className="text-sm text-black font-semibold capitalize">
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {activeTab === "tags" && product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
