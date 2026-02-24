// components/home/HeroCarousel.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  FiTag,
  FiShoppingCart,
  FiPercent,
  FiCopy,
  FiArrowRight,
  FiStar,
  FiCheck,
  FiBox,
  FiTruck,
  FiHeadphones,
} from "react-icons/fi";

/* ─── 4-point Star SVG ─── */
const Star4 = ({ className = "" }) => (
  <svg viewBox="0 0 56 56" fill="currentColor" className={className}>
    <path d="M28 0C28 0 33 22 28 28C22 33 0 28 0 28C0 28 22 22 28 28C33 22 56 28 56 28C56 28 33 33 28 28C22 33 28 56 28 56C28 56 22 33 28 28Z" />
  </svg>
);

/* ─── Floating particles component ─── */
const FloatingParticles = ({ color = "bg-gray-300" }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={`absolute w-1 h-1 ${color} rounded-full opacity-40`}
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `float ${3 + i * 0.7}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
  </div>
);

/* ─── Animated counter hook ─── */
const useCountUp = (end, duration = 1500, active = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    ref.current = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(ref.current);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(ref.current);
  }, [end, duration, active]);
  return count;
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 1 — Coupon / Special Offer
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CouponSlide = ({ isActive }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("UNITY20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-[#f5f0ff] to-fuchsia-50" />

      {/* Mesh gradient blobs */}
      <div className="absolute top-[-10%] right-[20%] w-125 h-125 bg-purple-300/20 rounded-full blur-[100px] animate-[drift_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[-15%] left-[10%] w-100 h-100 bg-indigo-300/15 rounded-full blur-[80px] animate-[drift_10s_ease-in-out_infinite_alternate-reverse]" />
      <div className="absolute top-[40%] left-[60%] w-75 h-75 bg-pink-200/15 rounded-full blur-[80px] animate-[drift_12s_ease-in-out_infinite_alternate]" />

      <FloatingParticles color="bg-purple-400" />

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left */}
            <div
              className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-bold border border-purple-200/60">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                Limited Time Offer
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
                Get{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    20% OFF
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-purple-200/50 -skew-x-3 rounded-sm" />
                </span>
                <br />
                Your First Order
              </h1>

              <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
                Use our exclusive coupon code and save big on your first purchase at UnityShop!
              </p>

              {/* Coupon code box */}
              <div className="inline-flex items-center gap-3 bg-white border-2 border-dashed border-purple-300 rounded-2xl px-6 py-3.5 shadow-xl shadow-purple-100/60">
                <span className="text-xl sm:text-2xl font-mono font-black tracking-[0.25em] bg-linear-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  UNITY20
                </span>
                <button
                  onClick={handleCopy}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    copied
                      ? "bg-green-100 text-green-600 scale-110"
                      : "bg-purple-50 hover:bg-purple-100 text-purple-600"
                  }`}
                  title="Copy code"
                >
                  {copied ? (
                    <FiCheck className="w-4 h-4" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-gray-900/25 hover:shadow-gray-900/35 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300"
                >
                  Shop Now <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-4 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Browse Products
                </Link>
              </div>

              {/* Mini feature icons */}
              <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                {[
                  { icon: FiBox, text: "20% Off First Order" },
                  { icon: FiTruck, text: "Free Delivery" },
                  { icon: FiHeadphones, text: "24/7 Support" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500">
                    <f.icon className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – 3D Coupon Card with glow */}
            <div
              className={`hidden md:block relative transition-all duration-1000 delay-200 ${isActive ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-12 rotate-6"}`}
              style={{ perspective: "1000px" }}
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 scale-110 bg-purple-400/20 rounded-3xl blur-3xl" />

              <Star4 className="absolute -top-8 -right-6 w-12 h-12 text-purple-300 animate-[spin_8s_linear_infinite]" />
              <Star4 className="absolute bottom-10 -left-10 w-8 h-8 text-amber-300 animate-[spin_12s_linear_infinite_reverse]" />
              <Star4 className="absolute top-1/3 -right-10 w-6 h-6 text-indigo-300 animate-pulse" />

              <div
                className="relative w-72 lg:w-85 h-48 lg:h-56 bg-linear-to-br from-purple-500 via-violet-600 to-indigo-700 rounded-3xl shadow-2xl shadow-purple-600/30 p-7 flex flex-col justify-between overflow-hidden hover:shadow-purple-500/40 transition-shadow duration-500"
                style={{
                  transform: "rotateY(-10deg) rotateX(5deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent rounded-3xl" />
                {/* Holographic stripe */}
                <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-linear-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-200/70">
                    Unity Coupon
                  </span>
                  <span className="text-xs font-mono bg-white/15 px-3 py-1 rounded-lg text-white/90 backdrop-blur-sm border border-white/10">
                    #UNITY20
                  </span>
                </div>
                <div className="relative z-10">
                  <p className="text-6xl lg:text-7xl font-black text-white drop-shadow-lg leading-none">
                    20%
                  </p>
                  <p className="text-sm font-semibold text-purple-200/80 mt-2 tracking-wide">
                    off everything
                  </p>
                </div>
                {/* Notches */}
                <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-violet-50 rounded-full shadow-inner" />
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-violet-50 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 2 — Products / Explore
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ProductSlide = ({ isActive }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-[#f0f7ff] to-cyan-50" />

    {/* Mesh gradient blobs */}
    <div className="absolute top-[-5%] right-[15%] w-112.5 h-112.5 bg-cyan-200/20 rounded-full blur-[100px] animate-[drift_9s_ease-in-out_infinite_alternate]" />
    <div className="absolute bottom-[-10%] left-[5%] w-87.5 h-87.5 bg-blue-200/15 rounded-full blur-[80px] animate-[drift_11s_ease-in-out_infinite_alternate-reverse]" />
    <div className="absolute top-[50%] right-[40%] w-62.5 h-62.5 bg-teal-200/10 rounded-full blur-[80px] animate-[drift_13s_ease-in-out_infinite_alternate]" />

    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />

    <FloatingParticles color="bg-cyan-400" />

    {/* Content */}
    <div className="relative h-full flex items-center z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left */}
          <div
            className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs sm:text-sm font-bold border border-cyan-200/60">
              <FiShoppingCart className="w-3.5 h-3.5" />
              Trending Now
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
              Find Products
              <br />
              That Match{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Your Style
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-cyan-200/50 -skew-x-3 rounded-sm" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
              Browse through our diverse range of meticulously crafted products, designed to bring out your individuality.
            </p>

            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-gray-900/25 hover:shadow-gray-900/35 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300"
              >
                Browse Products <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
              {[
                { val: "200+", label: "International Brands" },
                { val: "2,000+", label: "High-Quality Products" },
                { val: "30,000+", label: "Happy Customers" },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">
                    {s.val}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – 3D Floating Product Cards */}
          <div
            className={`hidden md:flex items-end gap-5 relative transition-all duration-1000 delay-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
            style={{ perspective: "1000px" }}
          >
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-300/15 rounded-full blur-3xl" />

            <Star4 className="absolute -top-6 right-4 w-14 h-14 text-gray-800 animate-[spin_10s_linear_infinite]" />
            <Star4 className="absolute top-1/2 -left-6 w-9 h-9 text-cyan-300 animate-[spin_14s_linear_infinite_reverse]" />

            {/* Card 1 */}
            <div
              className="w-44 lg:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-gray-300/40 space-y-3 border border-gray-100/80 hover:shadow-cyan-200/30 transition-shadow duration-500"
              style={{
                transform: "rotateY(10deg) rotateX(-3deg) translateZ(20px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-full aspect-square rounded-2xl bg-linear-to-br from-cyan-100 via-sky-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-200/30 to-transparent" />
                <FiShoppingCart className="w-14 h-14 text-cyan-500/40" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                <div className="h-3 bg-gray-50 rounded-full w-3/5" />
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">5.0</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="w-44 lg:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-gray-300/40 space-y-3 border border-gray-100/80 -mb-8 hover:shadow-emerald-200/30 transition-shadow duration-500"
              style={{
                transform: "rotateY(-6deg) rotateX(4deg) translateZ(40px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-full aspect-square rounded-2xl bg-linear-to-br from-emerald-100 via-green-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-200/30 to-transparent" />
                <FiTag className="w-14 h-14 text-emerald-500/40" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                <div className="h-3 bg-gray-50 rounded-full w-3/5" />
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 3 — Discount / Sale
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DiscountSlide = ({ isActive }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-[#fff5f5] to-orange-50" />

    {/* Mesh gradient blobs */}
    <div className="absolute top-[-10%] left-[20%] w-112.5 h-112.5 bg-rose-200/25 rounded-full blur-[100px] animate-[drift_8s_ease-in-out_infinite_alternate]" />
    <div className="absolute bottom-[-10%] right-[10%] w-87.5 h-87.5 bg-orange-200/20 rounded-full blur-[80px] animate-[drift_10s_ease-in-out_infinite_alternate-reverse]" />
    <div className="absolute top-[30%] right-[50%] w-75 h-75 bg-amber-200/10 rounded-full blur-[100px] animate-[drift_12s_ease-in-out_infinite_alternate]" />

    <FloatingParticles color="bg-rose-400" />

    {/* Content */}
    <div className="relative h-full flex items-center z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left */}
          <div
            className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold border border-rose-200/60">
              <FiPercent className="w-3.5 h-3.5" />
              Mega Sale
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
              Up To{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                  50% OFF
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-rose-200/50 -skew-x-3 rounded-sm" />
              </span>
              <br />
              On Top Brands
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
              Don&apos;t miss our biggest sale of the season! Massive discounts on electronics, fashion & more.
            </p>

            {/* Countdown timer */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              {[
                { val: "23", label: "Hours" },
                { val: "11", label: "Min" },
                { val: "45", label: "Sec" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-white rounded-2xl px-4 py-3 min-w-16 text-center shadow-xl shadow-rose-100/50 border border-gray-100/80">
                    <p className="text-2xl sm:text-3xl font-black font-mono text-gray-900 leading-none">
                      {t.val}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                      {t.label}
                    </p>
                  </div>
                  {i < 2 && (
                    <span className="text-2xl font-bold text-rose-300 animate-pulse">:</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-gray-900/25 hover:shadow-gray-900/35 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300"
              >
                Shop the Sale <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-8 pt-3">
              {[
                { val: "50%", label: "Max Discount" },
                { val: "500+", label: "Sale Items" },
                { val: "3 Days", label: "Left" },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">
                    {s.val}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – 3D Rotating Discount Badge */}
          <div
            className={`hidden md:flex items-center justify-center relative transition-all duration-1000 delay-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            style={{ perspective: "800px" }}
          >
            {/* Glow */}
            <div className="absolute inset-0 scale-90 bg-rose-300/15 rounded-full blur-3xl" />

            <Star4 className="absolute -top-4 right-8 w-12 h-12 text-rose-300 animate-[spin_8s_linear_infinite]" />
            <Star4 className="absolute bottom-8 -left-4 w-7 h-7 text-orange-300 animate-[spin_12s_linear_infinite_reverse]" />
            <Star4 className="absolute top-[60%] -right-6 w-5 h-5 text-amber-400 animate-pulse" />

            <div
              className="relative w-56 h-56 lg:w-68 lg:h-68"
              style={{ transform: "rotateY(-8deg) rotateX(5deg)" }}
            >
              {/* Outer dashed ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-rose-300/40 animate-[spin_30s_linear_infinite]" />
              {/* Middle ring */}
              <div className="absolute inset-3 rounded-full border border-rose-200/25" />
              {/* Inner circle */}
              <div className="absolute inset-5 rounded-full bg-white shadow-2xl shadow-rose-200/40 border border-rose-100/80 flex flex-col items-center justify-center hover:shadow-rose-300/50 transition-shadow duration-500">
                <p className="text-6xl lg:text-7xl font-black bg-linear-to-b from-rose-600 to-orange-500 bg-clip-text text-transparent leading-none">
                  50%
                </p>
                <p className="text-lg lg:text-xl font-black text-gray-900 uppercase tracking-[0.2em] mt-1">
                  OFF
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">
                  on selected items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ━━━━━━━━━━━━━━━━ Slides Array ━━━━━━━━━━━━━━━━ */
const slides = [
  { id: 1, component: CouponSlide },
  { id: 2, component: ProductSlide },
  { id: 3, component: DiscountSlide },
];

/* ━━━━━━━━━━━━━━━━ Main Carousel ━━━━━━━━━━━━━━━━ */
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayInterval = 6000;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Progress bar for auto-play
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!isAutoPlaying) {
      progressRef.current = 0;
      return;
    }
    progressRef.current = 0;
    const interval = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 100 / (autoPlayInterval / 50), 100);
      setProgress(progressRef.current);
    }, 50);
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div
      className="relative w-full h-130 sm:h-140 md:h-150 lg:h-165 overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const SlideComponent = slide.component;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-[1.03]"
            }`}
          >
            <SlideComponent isActive={index === currentSlide} />
          </div>
        );
      })}

      {/* Navigation Arrows — glass morphism style */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-xl border border-white/80 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-xl border border-white/80 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      {/* Dots + progress bar */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative h-2.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: index === currentSlide ? "36px" : "10px" }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                index === currentSlide ? "bg-gray-300" : "bg-gray-400/40 hover:bg-gray-400/70"
              }`}
            />
            {index === currentSlide && (
              <div
                className="absolute inset-0 rounded-full bg-gray-900 origin-left transition-none"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
