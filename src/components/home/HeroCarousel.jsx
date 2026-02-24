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

/* 4-point Star SVG */
const Star4 = ({ className = "" }) => (
  <svg viewBox="0 0 56 56" fill="currentColor" className={className}>
    <path d="M28 0C28 0 33 22 28 28C22 33 0 28 0 28C0 28 22 22 28 28C33 22 56 28 56 28C56 28 33 33 28 28C22 33 28 56 28 56C28 56 22 33 28 28Z" />
  </svg>
);

/* Floating particles */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-30"
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

/* ━━━ Slide 1 — Coupon ━━━ */
const CouponSlide = ({ isActive }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("UNITY20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="absolute top-[-10%] right-[20%] w-125 h-125 bg-gray-200/30 rounded-full blur-[100px] animate-[drift_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[-15%] left-[10%] w-100 h-100 bg-gray-300/20 rounded-full blur-[80px] animate-[drift_10s_ease-in-out_infinite_alternate-reverse]" />
      <FloatingParticles />

      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs sm:text-sm font-bold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Limited Time Offer
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.05] tracking-tight">
                Get{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">20% OFF</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-gray-300/60 -skew-x-3 rounded-sm" />
                </span>
                <br />
                Your First Order
              </h1>

              <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
                Use our exclusive coupon code and save big on your first purchase at UnityShop!
              </p>

              <div className="inline-flex items-center gap-3 bg-white border-2 border-dashed border-gray-400 rounded-2xl px-6 py-3.5 shadow-xl shadow-gray-200/60">
                <span className="text-xl sm:text-2xl font-mono font-black tracking-[0.25em] text-black">UNITY20</span>
                <button onClick={handleCopy} className={`p-2.5 rounded-xl transition-all duration-300 ${copied ? "bg-gray-200 text-black scale-110" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} title="Copy code">
                  {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <Link href="/products" className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-black hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300">
                  Shop Now <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-4 text-sm font-semibold text-gray-600 hover:text-black border-2 border-gray-300 hover:border-black rounded-full transition-all duration-300">
                  Browse Products
                </Link>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                {[
                  { icon: FiBox, text: "20% Off First Order" },
                  { icon: FiTruck, text: "Free Delivery" },
                  { icon: FiHeadphones, text: "24/7 Support" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500">
                    <f.icon className="w-4 h-4 text-black" />
                    <span className="text-xs font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – Coupon Card */}
            <div className={`hidden md:block relative transition-all duration-1000 delay-200 ${isActive ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-12 rotate-6"}`} style={{ perspective: "1000px" }}>
              <div className="absolute inset-0 scale-110 bg-gray-400/15 rounded-3xl blur-3xl" />
              <Star4 className="absolute -top-8 -right-6 w-12 h-12 text-gray-300 animate-[spin_8s_linear_infinite]" />
              <Star4 className="absolute bottom-10 -left-10 w-8 h-8 text-gray-400 animate-[spin_12s_linear_infinite_reverse]" />

              <div className="relative w-72 lg:w-85 h-48 lg:h-56 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl shadow-black/30 p-7 flex flex-col justify-between overflow-hidden" style={{ transform: "rotateY(-10deg) rotateX(5deg)", transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
                <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Unity Coupon</span>
                  <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg text-white/80 border border-white/10">#UNITY20</span>
                </div>
                <div className="relative z-10">
                  <p className="text-6xl lg:text-7xl font-black text-white drop-shadow-lg leading-none">20%</p>
                  <p className="text-sm font-semibold text-gray-400 mt-2 tracking-wide">off everything</p>
                </div>
                <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-50 rounded-full shadow-inner" />
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-50 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━ Slide 2 — Products ━━━ */
const ProductSlide = ({ isActive }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
    <div className="absolute top-[-5%] right-[15%] w-112.5 h-112.5 bg-gray-200/30 rounded-full blur-[100px] animate-[drift_9s_ease-in-out_infinite_alternate]" />
    <div className="absolute bottom-[-10%] left-[5%] w-87.5 h-87.5 bg-gray-300/20 rounded-full blur-[80px] animate-[drift_11s_ease-in-out_infinite_alternate-reverse]" />
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
    <FloatingParticles />

    <div className="relative h-full flex items-center z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs sm:text-sm font-bold">
              <FiShoppingCart className="w-3.5 h-3.5" />
              Trending Now
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.05] tracking-tight">
              Find Products<br />That Match{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Your Style</span>
                <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-gray-300/60 -skew-x-3 rounded-sm" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
              Browse through our diverse range of meticulously crafted products, designed to bring out your individuality.
            </p>

            <div>
              <Link href="/products" className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-black hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300">
                Browse Products <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
              {[
                { val: "200+", label: "International Brands" },
                { val: "2,000+", label: "High-Quality Products" },
                { val: "30,000+", label: "Happy Customers" },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-black">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Cards */}
          <div className={`hidden md:flex items-end gap-5 relative transition-all duration-1000 delay-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`} style={{ perspective: "1000px" }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl" />
            <Star4 className="absolute -top-6 right-4 w-14 h-14 text-gray-800 animate-[spin_10s_linear_infinite]" />
            <Star4 className="absolute top-1/2 -left-6 w-9 h-9 text-gray-300 animate-[spin_14s_linear_infinite_reverse]" />

            <div className="w-44 lg:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-gray-300/40 space-y-3 border border-gray-200" style={{ transform: "rotateY(10deg) rotateX(-3deg) translateZ(20px)", transformStyle: "preserve-3d" }}>
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
                <FiShoppingCart className="w-14 h-14 text-gray-300" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full w-4/5" />
                <div className="h-3 bg-gray-100 rounded-full w-3/5" />
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (<FiStar key={i} className="w-3.5 h-3.5 text-gray-800 fill-gray-800" />))}
                  <span className="text-[10px] text-gray-400 ml-1">5.0</span>
                </div>
              </div>
            </div>

            <div className="w-44 lg:w-52 bg-white rounded-3xl p-5 shadow-2xl shadow-gray-300/40 space-y-3 border border-gray-200 -mb-8" style={{ transform: "rotateY(-6deg) rotateX(4deg) translateZ(40px)", transformStyle: "preserve-3d" }}>
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-200 to-gray-50 flex items-center justify-center">
                <FiTag className="w-14 h-14 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full w-4/5" />
                <div className="h-3 bg-gray-100 rounded-full w-3/5" />
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (<FiStar key={i} className="w-3.5 h-3.5 text-gray-800 fill-gray-800" />))}
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

/* ━━━ Slide 3 — Discount ━━━ */
const DiscountSlide = ({ isActive }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50" />
    <div className="absolute top-[-10%] left-[20%] w-112.5 h-112.5 bg-gray-200/30 rounded-full blur-[100px] animate-[drift_8s_ease-in-out_infinite_alternate]" />
    <div className="absolute bottom-[-10%] right-[10%] w-87.5 h-87.5 bg-gray-300/20 rounded-full blur-[80px] animate-[drift_10s_ease-in-out_infinite_alternate-reverse]" />
    <FloatingParticles />

    <div className="relative h-full flex items-center z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className={`max-w-xl text-center md:text-left space-y-5 transition-all duration-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs sm:text-sm font-bold">
              <FiPercent className="w-3.5 h-3.5" />
              Mega Sale
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.05] tracking-tight">
              Up To{" "}
              <span className="relative inline-block">
                <span className="relative z-10">50% OFF</span>
                <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-gray-300/60 -skew-x-3 rounded-sm" />
              </span>
              <br />On Top Brands
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed">
              Don&apos;t miss our biggest sale of the season! Massive discounts on electronics, fashion & more.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              {[
                { val: "23", label: "Hours" },
                { val: "11", label: "Min" },
                { val: "45", label: "Sec" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-black rounded-2xl px-4 py-3 min-w-16 text-center shadow-xl shadow-black/10">
                    <p className="text-2xl sm:text-3xl font-black font-mono text-white leading-none">{t.val}</p>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-1">{t.label}</p>
                  </div>
                  {i < 2 && <span className="text-2xl font-bold text-gray-400 animate-pulse">:</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
              <Link href="/products" className="inline-flex items-center gap-2.5 px-8 py-4 text-sm sm:text-base bg-black hover:bg-gray-800 text-white font-bold rounded-full shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300">
                Shop the Sale <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8 pt-3">
              {[
                { val: "50%", label: "Max Discount" },
                { val: "500+", label: "Sale Items" },
                { val: "3 Days", label: "Left" },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-black">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Discount Badge */}
          <div className={`hidden md:flex items-center justify-center relative transition-all duration-1000 delay-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} style={{ perspective: "800px" }}>
            <div className="absolute inset-0 scale-90 bg-gray-300/20 rounded-full blur-3xl" />
            <Star4 className="absolute -top-4 right-8 w-12 h-12 text-gray-300 animate-[spin_8s_linear_infinite]" />
            <Star4 className="absolute bottom-8 -left-4 w-7 h-7 text-gray-400 animate-[spin_12s_linear_infinite_reverse]" />

            <div className="relative w-56 h-56 lg:w-68 lg:h-68" style={{ transform: "rotateY(-8deg) rotateX(5deg)" }}>
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-gray-400/40 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-gray-300/30" />
              <div className="absolute inset-5 rounded-full bg-white shadow-2xl shadow-gray-300/40 border border-gray-200 flex flex-col items-center justify-center">
                <p className="text-6xl lg:text-7xl font-black text-black leading-none">50%</p>
                <p className="text-lg lg:text-xl font-black text-black uppercase tracking-[0.2em] mt-1">OFF</p>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wide">on selected items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ━━━━━ Slides Array ━━━━━ */
const slides = [
  { id: 1, component: CouponSlide },
  { id: 2, component: ProductSlide },
  { id: 3, component: DiscountSlide },
];

/* ━━━━━ Main Carousel ━━━━━ */
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

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!isAutoPlaying) { progressRef.current = 0; return; }
    progressRef.current = 0;
    const interval = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 100 / (autoPlayInterval / 50), 100);
      setProgress(progressRef.current);
    }, 50);
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="relative w-full h-130 sm:h-140 md:h-150 lg:h-165 overflow-hidden group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {slides.map((slide, index) => {
        const SlideComponent = slide.component;
        return (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.03]"}`}>
            <SlideComponent isActive={index === currentSlide} />
          </div>
        );
      })}

      <button onClick={prevSlide} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-black hover:text-white border border-gray-200 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg" aria-label="Previous slide">
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-black hover:text-white border border-gray-200 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg" aria-label="Next slide">
        <FiChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)} className="relative h-2.5 rounded-full overflow-hidden transition-all duration-300" style={{ width: index === currentSlide ? "36px" : "10px" }} aria-label={`Go to slide ${index + 1}`}>
            <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${index === currentSlide ? "bg-gray-300" : "bg-gray-400/40 hover:bg-gray-400/70"}`} />
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-black origin-left transition-none" style={{ transform: `scaleX(${progress / 100})` }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
