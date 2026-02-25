// components/home/FeaturesStrip.jsx
"use client";

import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    desc: "On orders over $50",
  },
  {
    icon: FiShield,
    title: "Secure Payment",
    desc: "100% protected",
  },
  {
    icon: FiRefreshCw,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    desc: "We're here to help",
  },
];

const FeaturesStrip = () => {
  return (
    <section className="py-6 sm:py-8 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3 sm:gap-4 py-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black leading-tight">
                    {f.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;
