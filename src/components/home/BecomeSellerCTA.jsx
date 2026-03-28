"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";
import Button from "@/components/common/Button";

const highlights = [
  { icon: FiShoppingBag, text: "Free Setup" },
  { icon: FiUsers, text: "Millions of Buyers" },
  { icon: FiTrendingUp, text: "Fast Payments" },
];

const BecomeSellerCTA = () => {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="seller-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#seller-grid)" />
            </svg>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-10 lg:p-14">
            {/* Left side — text */}
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug">
                Bring Your Business Online{" "}
                <span className="inline-block animate-bounce">🚀</span>
              </h2>

              <p className="mt-3 text-base sm:text-lg text-gray-400 leading-relaxed">
                Set up your shop in 10 minutes and reach millions of buyers
              </p>

              {/* Highlight chips */}
              <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-3">
                {highlights.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1.5 text-sm font-medium text-white border border-white/20"
                    >
                      <Icon className="w-4 h-4" />
                      {item.text}
                    </span>
                  );
                })}
              </div>

              {/* CTA button */}
              <div className="mt-7">
                <Button
                  href="/register?role=seller"
                  variant="light"
                  className="!px-7 !py-3.5 !text-base sm:!text-lg !rounded-full shadow-lg shadow-black/30"
                >
                  Start Selling — Free
                </Button>
              </div>
            </div>

            {/* Right side — stats card */}
            <div className="flex-shrink-0 w-full max-w-xs">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center">
                <div className="text-5xl mb-3">💰</div>
                <p className="text-gray-400 text-sm">
                  Sellers earned this month
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  $2.4{" "}
                  <span className="text-xl sm:text-2xl font-bold">Million</span>
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
                  <FiTrendingUp className="w-3.5 h-3.5" />
                  <span>18% more than last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSellerCTA;
