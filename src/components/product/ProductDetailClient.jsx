// src/components/product/ProductDetailClient.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: replace with useFetch(`/api/products/${productId}`) from @/hooks/useFetch

const PRODUCT = {
  id: "1",
  name: "Bouclé Accent Chair",
  tagline: "Sink into something considered",
  price: 320,
  originalPrice: 420,
  badge: "Sale",
  sku: "CHR-BOU-001",
  category: "Living Room",
  description:
    "Designed for the corner of a room that deserves attention. The Bouclé Accent Chair combines a hand-finished solid walnut frame with a cloud-soft bouclé upholstery in three seasonal colourways. Each piece is made to order and inspected before dispatch.",
  specs: [
    { label: "Dimensions", value: "W 75cm × D 80cm × H 85cm" },
    { label: "Seat Height", value: "42cm" },
    { label: "Frame", value: "Solid walnut, natural oil finish" },
    { label: "Upholstery", value: "100% bouclé wool blend" },
    { label: "Fill", value: "High-density foam + feather topper" },
    { label: "Weight", value: "18 kg" },
    { label: "Lead Time", value: "3–5 business days" },
    { label: "Care", value: "Professional clean only" },
  ],
  variants: {
    color: [
      { id: "cream", label: "Cream", hex: "#f5f0e8" },
      { id: "charcoal", label: "Charcoal", hex: "#3d3d3d" },
      { id: "sage", label: "Sage", hex: "#8fa68e" },
    ],
  },
  images: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=85",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
  ],
  seller: {
    name: "The Craft House",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    healthScore: 91,
    healthTier: "Gold",
    totalSales: 1_240,
    joined: "Mar 2023",
  },
  rating: 4.8,
  reviews: 124,
  inStock: true,
  stockLeft: 4,
  // Transparent Pricing Engine — 30-day price history (newest → oldest)
  priceHistory: [
    320, 320, 320, 340, 340, 360, 360, 380, 380, 400, 400, 420, 420, 420, 420,
    400, 380, 360, 340, 340, 320, 320, 320, 320, 320, 320, 340, 340, 320, 320,
  ],
  priceEvent: "Price dropped — 48hr seller campaign active",
};

const REVIEWS = [
  {
    id: 1,
    name: "Sophie L.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80",
    rating: 5,
    date: "12 Jan 2026",
    text: "Absolutely stunning chair. The bouclé texture is even richer in person and it arrived perfectly packaged.",
  },
  {
    id: 2,
    name: "Marcus T.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80",
    rating: 5,
    date: "3 Jan 2026",
    text: "Solid walnut legs are a cut above what I expected at this price. Delivery was fast and the seller was communicative.",
  },
  {
    id: 3,
    name: "Priya K.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
    rating: 4,
    date: "28 Dec 2025",
    text: "Lovely chair, sits beautifully in my reading corner. Knocked one star only because the lead time was a day longer than quoted.",
  },
];

const RELATED = [
  {
    id: 2,
    name: "Travertine Side Table",
    price: 375,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80",
  },
  {
    id: 3,
    name: "Wabi-Sabi Table Lamp",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
  },
  {
    id: 4,
    name: "Hand-Knotted Wool Rug",
    price: 485,
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252eef8?w=500&q=80",
  },
  {
    id: 5,
    name: "Merino Throw Blanket",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }) {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`${s} ${n <= Math.round(rating) ? "text-amber-500" : "text-stone-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Inline SVG sparkline — no chart library needed
function PriceSparkline({ data }) {
  const W = 120,
    H = 36,
    PAD = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - (v - min) / range) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const firstPrice = data[data.length - 1];
  const lastPrice = data[0];
  const isDown = lastPrice <= firstPrice;
  const color = isDown ? "#16a34a" : "#dc2626";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity=".9"
      />
      <circle
        cx={points.split(" ")[0].split(",")[0]}
        cy={points.split(" ")[0].split(",")[1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

// Seller health tier style
const tierStyle = {
  Gold: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Silver: {
    bg: "bg-stone-50",
    text: "text-stone-600",
    border: "border-stone-200",
    dot: "bg-stone-400",
  },
  Bronze: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
  "At-Risk": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProductDetailClient({ productId }) {
  const p = PRODUCT; // swap with useFetch result

  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(p.variants.color[0].id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [zoomPos, setZoomPos] = useState(null);
  const imageRef = useRef(null);

  const tier = tierStyle[p.seller.healthTier] ?? tierStyle.Silver;
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
    // TODO: CartContext → addToCart({ ...p, quantity, color: activeColor })
  };

  // Image zoom on mouse move
  const handleMouseMove = (e) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const tabs = ["description", "specs", "reviews", "buyer room"];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-stone-400">
            <Link href="/" className="hover:text-stone-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-stone-700 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href="/products?category=living"
              className="hover:text-stone-700 transition-colors"
            >
              {p.category}
            </Link>
            <span>/</span>
            <span className="text-stone-700 truncate max-w-[180px]">
              {p.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════ MAIN SPLIT LAYOUT */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-8 xl:gap-16">
          {/* ── LEFT — Image Gallery ─────────────────────────────────── */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail strip */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-1 md:pb-0">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i
                      ? "border-stone-900 opacity-100"
                      : "border-transparent opacity-55 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image with zoom */}
            <div
              className="relative flex-1 min-h-[400px] md:min-h-[560px] lg:min-h-[640px] rounded-2xl overflow-hidden bg-stone-100 group cursor-zoom-in"
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomPos(null)}
            >
              <Image
                src={p.images[activeImage]}
                alt={p.name}
                fill
                priority
                className={`object-cover transition-transform duration-700 ${zoomPos ? "scale-150" : "scale-100"}`}
                style={
                  zoomPos
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : {}
                }
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {/* Badge */}
              {p.badge && (
                <div className="absolute top-4 left-4">
                  <span className="bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg tracking-wide">
                    {discount}% OFF
                  </span>
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-stone-400"}`}
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Arrow nav */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() =>
                    setActiveImage(
                      (i) => (i - 1 + p.images.length) % p.images.length,
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors pointer-events-auto"
                >
                  <svg
                    className="w-4 h-4 text-stone-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveImage((i) => (i + 1) % p.images.length)
                  }
                  className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors pointer-events-auto"
                >
                  <svg
                    className="w-4 h-4 text-stone-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {activeImage + 1} / {p.images.length}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Product Info (sticky) ────────────────────────── */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            {/* Name + tagline */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-amber-800 font-medium mb-2">
                {p.category}
              </p>
              <h1 className="font-display text-4xl xl:text-5xl font-light text-stone-900 leading-tight tracking-tight">
                {p.name}
              </h1>
              <p className="font-body text-stone-500 text-lg mt-2 italic">
                {p.tagline}
              </p>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Stars rating={p.rating} size="lg" />
                <span className="font-display text-lg font-light text-stone-900">
                  {p.rating}
                </span>
              </div>
              <button
                onClick={() => setActiveTab("reviews")}
                className="text-sm text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors"
              >
                {p.reviews} reviews
              </button>
              <span className="text-stone-300">·</span>
              <span className="text-sm text-stone-500">
                SKU: <span className="text-stone-700 font-medium">{p.sku}</span>
              </span>
            </div>

            {/* ── Price + sparkline ──────────────────────────────────── */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl font-light text-stone-900">
                      ${p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xl text-stone-400 line-through font-light">
                        ${p.originalPrice}
                      </span>
                    )}
                  </div>
                  {discount && (
                    <span className="text-sm text-rose-600 font-medium">
                      You save ${p.originalPrice - p.price}
                    </span>
                  )}
                </div>
                {/* Sparkline + info */}
                <div className="flex flex-col items-end gap-1">
                  <PriceSparkline data={p.priceHistory} />
                  <button
                    onClick={() => setShowPriceInfo(!showPriceInfo)}
                    className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    30-day price history
                  </button>
                </div>
              </div>

              {/* Transparent price event banner */}
              {showPriceInfo && (
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-emerald-600 text-base mt-0.5">📉</span>
                  <div>
                    <p className="text-xs font-semibold text-emerald-800 mb-0.5">
                      Why this price?
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {p.priceEvent}
                    </p>
                  </div>
                </div>
              )}

              {/* Low stock indicator */}
              {p.stockLeft <= 5 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse flex-shrink-0" />
                  <p className="text-xs font-medium text-amber-800">
                    Only <strong>{p.stockLeft} left</strong> in stock — order
                    soon
                  </p>
                </div>
              )}
            </div>

            {/* ── Colour selector ───────────────────────────────────── */}
            <div>
              <p className="text-sm font-medium text-stone-700 mb-3">
                Colour —{" "}
                <span className="font-normal text-stone-500 capitalize">
                  {p.variants.color.find((c) => c.id === activeColor)?.label}
                </span>
              </p>
              <div className="flex gap-3">
                {p.variants.color.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveColor(c.id)}
                    title={c.label}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      activeColor === c.id
                        ? "border-stone-900 scale-110 shadow-md"
                        : "border-stone-200"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* ── Quantity + Add to Cart ────────────────────────────── */}
            <div className="flex gap-3">
              {/* Quantity stepper */}
              <div className="flex items-center bg-white border border-stone-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors text-xl font-light"
                >
                  −
                </button>
                <span className="w-10 text-center text-stone-900 font-medium text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(p.stockLeft, q + 1))
                  }
                  className="w-11 h-12 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors text-xl font-light"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!p.inStock}
                className={`flex-1 h-12 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 transform active:scale-95 ${
                  addedToCart
                    ? "bg-emerald-600 text-white scale-[1.01]"
                    : "bg-stone-900 text-white hover:bg-amber-800 hover:scale-[1.01]"
                }`}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              {/* Share */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 transition-all">
                <svg
                  className="w-4 h-4 text-stone-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>

            {/* ── Seller card ───────────────────────────────────────── */}
            <div
              className={`flex items-center justify-between border rounded-2xl p-4 ${tier.bg} ${tier.border}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
                  <Image
                    src={p.seller.avatar}
                    alt={p.seller.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${tier.text}`}>
                    {p.seller.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {p.seller.totalSales.toLocaleString()} sales · Since{" "}
                    {p.seller.joined}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
                  {p.seller.healthTier} Seller
                </div>
                <p className={`text-xs font-semibold ${tier.text}`}>
                  {p.seller.healthScore}/100
                </p>
              </div>
            </div>

            {/* ── Trust strip ───────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🚚", label: "Free Shipping", sub: "Orders over $50" },
                { icon: "↩️", label: "30-Day Returns", sub: "Hassle-free" },
                { icon: "🔒", label: "Secure Payment", sub: "256-bit SSL" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-stone-100 rounded-xl p-3 text-center"
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-stone-700 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {/* end right panel */}
        </div>
        {/* end main grid */}

        {/* ══════════════════════════════════ TABS SECTION */}
        <div className="mt-16 lg:mt-20">
          {/* Tab nav */}
          <div className="flex gap-0 border-b border-stone-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize tracking-wide whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab === "reviews" ? `${tab} (${p.reviews})` : tab}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="py-10 max-w-3xl">
            {/* Description */}
            {activeTab === "description" && (
              <div className="space-y-5 animate-fadeIn">
                <p className="font-body text-stone-600 text-lg leading-relaxed">
                  {p.description}
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    "Hand-finished solid walnut frame",
                    "Cloud-soft bouclé wool blend upholstery",
                    "High-density foam with feather topper",
                    "Made to order — inspected before dispatch",
                    "Available in three seasonal colourways",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-stone-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {activeTab === "specs" && (
              <div className="animate-fadeIn">
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                  {p.specs.map((s, i) => (
                    <div
                      key={s.label}
                      className={`flex gap-6 px-6 py-4 ${i % 2 === 0 ? "bg-stone-50/50" : "bg-white"}`}
                    >
                      <span className="text-sm font-medium text-stone-500 w-36 flex-shrink-0">
                        {s.label}
                      </span>
                      <span className="text-sm text-stone-800">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Summary bar */}
                <div className="flex items-center gap-8 bg-white border border-stone-200 rounded-2xl p-6 mb-8">
                  <div className="text-center">
                    <div className="font-display text-6xl font-light text-stone-900">
                      {p.rating}
                    </div>
                    <Stars rating={p.rating} size="lg" />
                    <p className="text-sm text-stone-400 mt-1">
                      {p.reviews} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5
                          ? 74
                          : star === 4
                            ? 18
                            : star === 3
                              ? 5
                              : star === 2
                                ? 2
                                : 1;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-stone-500 w-4">
                            {star}
                          </span>
                          <svg
                            className="w-3 h-3 text-amber-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 bg-stone-100 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-400 w-8">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                {REVIEWS.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={r.avatar}
                            alt={r.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">
                            {r.name}
                          </p>
                          <p className="text-xs text-stone-400">{r.date}</p>
                        </div>
                      </div>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {r.text}
                    </p>
                    <div className="flex items-center gap-1 mt-3">
                      <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                        ✓ Verified Purchase
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buyer Room teaser */}
            {activeTab === "buyer room" && (
              <div className="animate-fadeIn">
                <div className="bg-stone-900 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="font-display text-2xl font-light text-white mb-2">
                    Buyer Community Room
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                    Purchase this product to join a private room with all
                    verified buyers. Share photos, ask questions, and get tips
                    directly from the seller.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center text-sm text-stone-400 mb-6">
                    {[
                      "📸 Share your setup",
                      "🙋 Ask other owners",
                      "🏷️ Exclusive buyer offers",
                      "✍️ Leave a verified review",
                    ].map((f) => (
                      <span
                        key={f}
                        className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-white text-stone-900 font-semibold px-8 py-3 rounded-full text-sm hover:bg-amber-100 transition-colors"
                  >
                    Buy to Unlock Room →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════ RELATED PRODUCTS */}
        <div className="mt-8 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-light text-stone-900">
              You may also like
            </h2>
            <Link
              href="/products"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              View all <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {RELATED.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-500"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-body text-sm text-stone-700 group-hover:text-stone-900 transition-colors leading-snug">
                    {item.name}
                  </p>
                  <p className="font-display text-lg font-light text-stone-900 mt-1">
                    ${item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* end max-w wrapper */}

      {/* ══════════════════════════════════ MOBILE STICKY BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-stone-200 px-4 py-3 flex gap-3 items-center shadow-2xl">
        <div>
          <p className="text-xs text-stone-500 leading-none">Total</p>
          <p className="font-display text-xl font-light text-stone-900">
            ${p.price * quantity}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-12 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
            addedToCart
              ? "bg-emerald-600 text-white"
              : "bg-stone-900 text-white hover:bg-amber-800"
          }`}
        >
          {addedToCart
            ? "✓ Added to Cart"
            : `Add ${quantity > 1 ? `(×${quantity})` : ""} to Cart`}
        </button>
      </div>
    </div>
  );
}
