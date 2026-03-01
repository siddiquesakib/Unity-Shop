// components/home/HeroCarousel.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

/* ━━━━━ Slide Data ━━━━━ */
const slides = [
  {
    id: 1,
    badge: "🔥 Eid Special",
    headline: "Eid Special — Up to 50% Off!",
    subtext:
      "Fashion, Electronics, Home Decor — Massive discounts on everything",
    cta: "Shop Now",
    ctaLink: "/products",
    gradient: "from-black via-gray-900 to-gray-800",
    bgPattern:
      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
    accentColor: "bg-white text-black",
    image: "🛍️",
    offer: "50%",
  },
  {
    id: 2,
    badge: "⚡ Flash Sale",
    headline: "Today's Flash Sale — Limited Time!",
    subtext: "New deals every day, limited stock — Order now before it's gone",
    cta: "Shop Now",
    ctaLink: "/products",
    gradient: "from-gray-900 via-gray-800 to-gray-700",
    bgPattern:
      "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)",
    accentColor: "bg-white text-black",
    image: "⚡",
    offer: "70%",
  },
  {
    id: 3,
    badge: "📱 New Collection",
    headline: "Smartphone Fest — Best Prices!",
    subtext: "Samsung, iPhone, Xiaomi — EMI options & warranty on all brands",
    cta: "Shop Now",
    ctaLink: "/products?category=Mobiles",
    gradient: "from-gray-800 via-gray-900 to-black",
    bgPattern:
      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.07) 0%, transparent 50%)",
    accentColor: "bg-white text-black",
    image: "📱",
    offer: "30%",
  },
  {
    id: 4,
    badge: "🎁 Coupon Offer",
    headline: "20% Off on Your First Order!",
    subtext: "Use coupon code UNITY20 — applicable on all products",
    cta: "Shop Now",
    ctaLink: "/products",
    gradient: "from-gray-950 via-black to-gray-900",
    bgPattern:
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 50%)",
    accentColor: "bg-white text-black",
    image: "🎁",
    offer: "20%",
    coupon: "UNITY20",
  },
];

/* ━━━━━ Side Cards Data ━━━━━ */
const sideCards = [
  {
    title: "New Arrivals",
    emoji: "🆕",
    subtitle: "Browse the latest products",
    link: "/products?sort=newest",
    gradient: "from-gray-800 to-gray-900",
  },
  {
    title: "Flash Sale",
    emoji: "⚡",
    subtitle: "Limited time offers",
    link: "/products",
    gradient: "from-gray-900 to-black",
  },
  {
    title: "Best Deals",
    emoji: "🔥",
    subtitle: "Buy at the lowest prices",
    link: "/products?sort=price-asc",
    gradient: "from-black to-gray-800",
  },
];

/* ━━━━━ Main Component ━━━━━ */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const intervalMs = 5000;

  // Touch/swipe
  const touchRef = useRef({ startX: 0, startY: 0 });
  const sliderRef = useRef(null);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % slides.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
    [],
  );

  // Auto-play
  useEffect(() => {
    if (!isAuto) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [isAuto, next]);

  // Progress bar
  useEffect(() => {
    if (!isAuto) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (intervalMs / 50);
        return next >= 100 ? 0 : next;
      });
    }, 50);
    return () => {
      clearInterval(id);
      setProgress(0);
    };
  }, [current, isAuto]);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#f7f6f3]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex gap-3 lg:gap-4">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MAIN SLIDER                                                    */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div
            ref={sliderRef}
            className="relative flex-1 rounded-2xl lg:rounded-3xl overflow-hidden h-55 sm:h-70 md:h-85 lg:h-100 group"
            onMouseEnter={() => setIsAuto(false)}
            onMouseLeave={() => setIsAuto(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides */}
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  i === current
                    ? "opacity-100 z-10 translate-x-0"
                    : i < current
                      ? "opacity-0 z-0 -translate-x-full"
                      : "opacity-0 z-0 translate-x-full"
                }`}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${slide.gradient}`}
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: slide.bgPattern }}
                />
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/6 rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/4 rounded-full" />

                {/* Content */}
                <div className="relative h-full flex items-center z-10 px-6 sm:px-8 lg:px-12">
                  <div
                    className={`max-w-lg space-y-3 sm:space-y-4 transition-all duration-700 delay-100 ${i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  >
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${slide.accentColor}`}
                    >
                      {slide.badge}
                    </span>

                    {/* Headline */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                      {slide.headline}
                    </h2>

                    {/* Subtext */}
                    <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-md leading-relaxed line-clamp-2">
                      {slide.subtext}
                    </p>

                    {/* Coupon (if any) */}
                    {slide.coupon && (
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                        <span className="text-base sm:text-lg font-mono font-black text-white tracking-[0.2em]">
                          {slide.coupon}
                        </span>
                        <button
                          onClick={() => handleCopy(slide.coupon)}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                        >
                          {copied ? (
                            <FiCheck size={14} />
                          ) : (
                            <FiCopy size={14} />
                          )}
                        </button>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-1">
                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-white text-gray-900 font-bold text-xs sm:text-sm rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20"
                      >
                        {slide.cta}
                        <FiArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Right side — Offer circle (desktop) */}
                  <div
                    className={`hidden md:flex absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 transition-all duration-700 delay-200 ${i === current ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                  >
                    <div className="relative">
                      <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full border-[3px] border-dashed border-white/30 flex items-center justify-center animate-[spin_15s_linear_infinite]" />
                      <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                        <span className="text-4xl lg:text-5xl">
                          {slide.image}
                        </span>
                        <span className="text-xl lg:text-2xl font-black text-white mt-1">
                          {slide.offer}
                        </span>
                        <span className="text-[10px] lg:text-xs text-white/60 font-semibold uppercase tracking-wider">
                          OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows (desktop) */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Previous"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Next"
            >
              <FiChevronRight size={20} />
            </button>

            {/* Dots + Progress */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === current ? "32px" : "8px" }}
                  aria-label={`Slide ${i + 1}`}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-colors ${i === current ? "bg-white/40" : "bg-white/25 hover:bg-white/40"}`}
                  />
                  {i === current && (
                    <div
                      className="absolute inset-0 rounded-full bg-white origin-left"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SIDE CARDS (desktop only)                                      */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex flex-col gap-3 w-55 xl:w-65 shrink-0">
            {sideCards.map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className="group/card relative flex-1 rounded-2xl overflow-hidden flex flex-col justify-center px-5 py-4 transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                {/* BG */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${card.gradient}`}
                />
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/8 rounded-full" />

                {/* Content */}
                <div className="relative z-10">
                  <span className="text-2xl xl:text-3xl block mb-1">
                    {card.emoji}
                  </span>
                  <h3 className="text-base xl:text-lg font-bold text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-snug">
                    {card.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium mt-2 group-hover/card:text-white group-hover/card:gap-2 transition-all">
                    View <FiArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MOBILE SIDE CARDS (horizontal scroll below slider)             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden mt-3 -mx-3 px-3">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {sideCards.map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className="relative shrink-0 w-40 sm:w-45 rounded-xl overflow-hidden px-4 py-3.5"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${card.gradient}`}
                />
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/8 rounded-full" />
                <div className="relative z-10">
                  <span className="text-xl block mb-0.5">{card.emoji}</span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    {card.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-white/70 text-[11px] font-medium mt-1.5">
                    View <FiArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
