// components/home/PromoBanners.jsx
"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/* ━━━━━ Banner Data ━━━━━ */
const banners = [
  {
    id: 1,
    emoji: "🏷️",
    headline: "New Seller Products",
    subtext: "Up to 40% Off",
    description: "Buy from verified new sellers at the best prices",
    cta: "Shop Now",
    link: "/products",
    bg: "bg-black/80 backdrop-blur-md",
    textColor: "text-white",
    subtextColor: "text-gray-400",
    ctaBg: "bg-white text-black hover:bg-gray-100",
    decorColor: "bg-white/5",
  },
  {
    id: 2,
    emoji: "💳",
    headline: "bKash Payment",
    subtext: "10% Cashback",
    description: "Get instant cashback when you pay with bKash or Nagad",
    cta: "Shop Now",
    link: "/products",
    bg: "bg-white/70 backdrop-blur-md border border-white/40",
    textColor: "text-black",
    subtextColor: "text-gray-500",
    ctaBg: "bg-black text-white hover:bg-gray-800",
    decorColor: "bg-gray-200/60",
  },
  {
    id: 3,
    emoji: "🚚",
    headline: "Free Delivery",
    subtext: "On Orders $500+",
    description: "Get fast and free delivery nationwide",
    cta: "Order Now",
    link: "/products",
    bg: "bg-gray-900/80 backdrop-blur-md",
    textColor: "text-white",
    subtextColor: "text-gray-400",
    ctaBg: "bg-white text-black hover:bg-gray-100",
    decorColor: "bg-white/5",
  },
];

const PromoBanners = () => {
  return (
    <section className="py-8 sm:py-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl m-4 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Desktop: 3-column grid ── */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className={`group relative ${banner.bg} rounded-2xl p-6 lg:p-8 flex flex-col justify-between min-h-48 overflow-hidden hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Decorative circles */}
              <div
                className={`absolute -top-10 -right-10 w-36 h-36 ${banner.decorColor} rounded-full`}
              />
              <div
                className={`absolute -bottom-8 -left-8 w-24 h-24 ${banner.decorColor} rounded-full`}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Emoji */}
                <span className="text-3xl lg:text-4xl mb-3">
                  {banner.emoji}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`text-lg lg:text-xl font-extrabold ${banner.textColor} leading-tight`}
                  >
                    {banner.headline}
                  </h3>
                  <p
                    className={`text-base lg:text-lg font-black ${banner.textColor} mt-0.5`}
                  >
                    {banner.subtext}
                  </p>
                  <p
                    className={`text-xs ${banner.subtextColor} mt-2 leading-relaxed line-clamp-2`}
                  >
                    {banner.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full ${banner.ctaBg} transition-all duration-200 group-hover:gap-2.5`}
                  >
                    {banner.cta}
                    <FiArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile: Horizontal scroll ── */}
        <div className="sm:hidden relative -mx-4">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory">
            {banners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link}
                className={`group relative shrink-0 w-[75vw] ${banner.bg} rounded-2xl p-5 flex flex-col justify-between min-h-44 overflow-hidden snap-start`}
              >
                {/* Decorative circles */}
                <div
                  className={`absolute -top-8 -right-8 w-28 h-28 ${banner.decorColor} rounded-full`}
                />
                <div
                  className={`absolute -bottom-6 -left-6 w-20 h-20 ${banner.decorColor} rounded-full`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-2xl mb-2">{banner.emoji}</span>

                  <div className="flex-1">
                    <h3
                      className={`text-base font-extrabold ${banner.textColor} leading-tight`}
                    >
                      {banner.headline}
                    </h3>
                    <p
                      className={`text-sm font-black ${banner.textColor} mt-0.5`}
                    >
                      {banner.subtext}
                    </p>
                    <p
                      className={`text-[11px] ${banner.subtextColor} mt-1.5 leading-relaxed line-clamp-2`}
                    >
                      {banner.description}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full ${banner.ctaBg} transition-colors`}
                    >
                      {banner.cta}
                      <FiArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default PromoBanners;
