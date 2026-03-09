"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiCopy, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    tag: "Eid ul-Adha 2025",
    headline: ["Dress for", "the occasion"],
    desc: "Curated fashion, electronics & home decor — up to 50% off for Eid.",
    cta: "Shop Now",
    ctaLink: "/products",
    offer: "50",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format",
  },
  {
    id: 2,
    tag: "Today Only",
    headline: ["Flash Sale", "live now"],
    desc: "Every hour a new deal drops. Limited stock — act before it's gone.",
    cta: "Shop Sale",
    ctaLink: "/products",
    offer: "70",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80&auto=format",
  },
  {
    id: 3,
    tag: "Tech Week",
    headline: ["Smartphone", "fest"],
    desc: "Samsung, iPhone, Xiaomi & more. EMI available · Official warranty.",
    cta: "View Phones",
    ctaLink: "/products?category=Mobiles",
    offer: "30",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80&auto=format",
  },
  {
    id: 4,
    tag: "First Order",
    headline: ["Your welcome", "gift awaits"],
    desc: "20% off on everything. No minimum order required.",
    cta: "Claim Offer",
    ctaLink: "/products",
    offer: "20",
    coupon: "UNITY20",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&auto=format",
  },
];

const INTERVAL = 5500;

export default function HeroSection() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const txRef = useRef(0);

  const goTo = useCallback((n) => {
    setCur(n);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo((cur + 1) % slides.length), [cur, goTo]);
  const prev = useCallback(() => goTo((cur - 1 + slides.length) % slides.length), [cur, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const id = setInterval(() => setProgress((p) => Math.min(p + 100 / (INTERVAL / 50), 100)), 50);
    return () => clearInterval(id);
  }, [cur, paused]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative bg-black overflow-hidden h-[clamp(440px,74vh,780px)] w-full font-sans group select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (txRef.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - txRef.current;
        if (Math.abs(dx) > 48) dx < 0 ? next() : prev();
      }}
    >
      {slides.map((s, i) => {
        const isActive = i === cur;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={s.img}
                alt={s.tag}
                fill
                priority={i === 0}
                className={`object-cover transition-transform duration-[9000ms] ease-out ${
                  isActive ? "scale-100" : "scale-105"
                }`}
                style={{ filter: "brightness(0.5) saturate(0.8)" }}
              />
              {/* Black Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-center sm:justify-end px-6 sm:px-12 md:px-20 pb-16 sm:pb-24 z-10 w-full max-w-7xl mx-auto">
              
              <div className="mt-auto max-w-2xl">
                {/* Eyebrow tag */}
                <div
                  className={`flex items-center gap-3 mb-5 transition-all duration-700 ease-out delay-100 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <span className="block w-8 h-[1px] bg-[#fcfbf7]/40" />
                  <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#fcfbf7]/60">
                    {s.tag}
                  </span>
                </div>

                {/* Headline */}
                <h2
                  className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light text-[#fcfbf7] leading-[1.05] tracking-tight mb-8 transition-all duration-700 ease-out delay-200 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  {s.headline[0]}
                  <br />
                  <em className="not-italic text-[#fcfbf7]/50 block mt-2">{s.headline[1]}</em>
                </h2>

                {/* Coupon */}
                {s.coupon && (
                  <div
                    className={`mb-8 transition-all duration-700 ease-out delay-300 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 border border-[#fcfbf7]/20 bg-[#fcfbf7]/5 backdrop-blur-md">
                      <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#fcfbf7]">
                        {s.coupon}
                      </span>
                      <button
                        onClick={() => handleCopy(s.coupon)}
                        className="text-[#fcfbf7]/40 hover:text-[#fcfbf7] transition-colors"
                        aria-label="Copy coupon code"
                      >
                        {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Description & CTA */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 transition-all duration-700 ease-out delay-400 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <p className="text-sm font-light text-[#fcfbf7]/60 leading-relaxed max-w-sm m-0">
                    {s.desc}
                  </p>
                  <Link
                    href={s.ctaLink}
                    className="group inline-flex items-center gap-3 px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase bg-[#fcfbf7] text-black border border-transparent hover:bg-transparent hover:text-[#fcfbf7] hover:border-[#fcfbf7]/30 transition-all duration-300"
                  >
                    {s.cta}
                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Outline Text Offer */}
            {s.offer && (
              <div
                className={`absolute top-[10%] right-[5%] text-[6rem] sm:text-[10rem] md:text-[14rem] font-bold text-transparent opacity-10 pointer-events-none select-none tracking-tighter transition-all duration-1000 ease-out ${
                  isActive ? "opacity-10 translate-x-0" : "opacity-0 translate-x-12"
                }`}
                style={{ WebkitTextStroke: '2px #fcfbf7' }}
              >
                {s.offer}%
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 text-[#fcfbf7]/40 hover:text-[#fcfbf7] transition-colors"
        onClick={prev}
        aria-label="Previous"
      >
        <FiChevronLeft size={36} strokeWidth={1} />
      </button>
      <button
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 text-[#fcfbf7]/40 hover:text-[#fcfbf7] transition-colors"
        onClick={next}
        aria-label="Next"
      >
        <FiChevronRight size={36} strokeWidth={1} />
      </button>

      {/* Sidebar Dot Navigation */}
      <div className="hidden absolute right-8 top-1/2 -translate-y-1/2 z-30 sm:flex flex-col gap-3 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-[2px] transition-all duration-300 ease-in-out ${
              i === cur ? "h-10 bg-[#fcfbf7]" : "h-5 bg-[#fcfbf7]/20 hover:bg-[#fcfbf7]/40"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-10 right-8 z-30 hidden sm:flex items-baseline gap-1.5 font-light">
        <span className="text-xl text-[#fcfbf7]/80">
          {String(cur + 1).padStart(2, "0")}
        </span>
        <span className="text-[10px] tracking-widest text-[#fcfbf7]/30">
          / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fcfbf7]/10 z-30">
        <div
          className="h-full bg-[#fcfbf7]/60"
          style={{
            width: `${progress}%`,
            transition: paused ? "none" : "width 50ms linear",
          }}
        />
      </div>
    </section>
  );
}
