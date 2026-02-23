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
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    icon: FiLock,
    title: "Secure Payments",
    description: "Your transactions are protected and encrypted",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    icon: FiCheckCircle,
    title: "Quality Guaranteed",
    description: "Inspection services to ensure product quality",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    icon: FiTruck,
    title: "On-time Shipping",
    description: "Reliable logistics with real-time tracking",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    icon: FiAward,
    title: "Buyer Protection",
    description: "Full refund if products don't meet standards",
    color: "from-yellow-500 to-amber-500",
  },
];

const TradeAssuranceBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
            <FiShield className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-sm font-semibold text-gray-700">
              Trade Assurance
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trade with Confidence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive protection program ensures safe and reliable
            transactions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start trading safely?
            </h3>
            <p className="text-lg mb-8 text-orange-100 max-w-2xl mx-auto">
              Join thousands of businesses who trust Unity Shop for their
              sourcing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/trade-assurance"
                className="px-8 py-3 bg-orange-700 text-white font-semibold rounded-full hover:bg-orange-800 hover:scale-105 transition-all shadow-lg border border-orange-400"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-70">
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">100% Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Verified Suppliers</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Money-back Guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeAssuranceBanner;
