// components/home/TradeAssuranceBanner.jsx
"use client";

import Link from "next/link";
import {
  FiShield,
  FiLock,
  FiCheckCircle,
  FiTruck,
  FiAward,
} from "react-icons/fi";

const features = [
  {
    id: 1,
    icon: FiShield,
    title: "Verified Suppliers",
    description: "Every supplier is verified for authenticity",
  },
  {
    id: 2,
    icon: FiLock,
    title: "Secure Payments",
    description: "Your transactions are protected and encrypted",
  },
  {
    id: 3,
    icon: FiCheckCircle,
    title: "Quality Guaranteed",
    description: "Inspection services to ensure product quality",
  },
  {
    id: 4,
    icon: FiTruck,
    title: "On-time Shipping",
    description: "Reliable logistics with real-time tracking",
  },
  {
    id: 5,
    icon: FiAward,
    title: "Buyer Protection",
    description: "Full refund if products don't meet standards",
  },
];

const TradeAssuranceBanner = () => {
  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              Why Choose UnityShop
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Trade with confidence
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
            <FiShield className="w-3.5 h-3.5 text-black" />
            <span className="text-xs font-medium text-gray-700">
              Trade Assurance
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-gray-50 hover:bg-white rounded-xl p-4 border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-black rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Ready to start?</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Join thousands of businesses on UnityShop
            </p>
          </div>
          <div className="relative z-10 flex gap-2.5">
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/products"
              className="px-5 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-full hover:bg-white/15 transition-colors"
            >
              Browse
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-6 text-gray-400">
          {[
            "100% Secure",
            "Verified Suppliers",
            "Money-back Guarantee",
            "24/7 Support",
          ].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5 text-black" />
              <span className="text-xs">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradeAssuranceBanner;
