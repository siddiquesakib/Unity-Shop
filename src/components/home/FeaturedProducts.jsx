"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const products = [
    {
      id: 1,
      name: "Artisan Ceramic Vase",
      price: 89.0,
      originalPrice: 129.0,
      image:
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      badge: "Best Seller",
      description: "Handcrafted minimalist design",
    },
    {
      id: 2,
      name: "Leather Journal Set",
      price: 64.0,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      badge: "New",
      description: "Premium full-grain leather",
    },
    {
      id: 3,
      name: "Minimalist Desk Lamp",
      price: 145.0,
      originalPrice: 189.0,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      badge: "Featured",
      description: "Adjustable LED lighting",
    },
    {
      id: 4,
      name: "Wool Throw Blanket",
      price: 98.0,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
      badge: "Trending",
      description: "Ethically sourced merino wool",
    },
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-linear-to-br from-stone-50 via-amber-50/30 to-stone-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(120, 113, 108) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        ></div>
      </div>

      {/* Floating Accent Shapes */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 left-[15%] w-96 h-96 bg-orange-300/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <span className="text-sm tracking-[0.3em] uppercase text-amber-800 font-light mb-2 block">
              Curated Selection
            </span>
            <h2 className="text-6xl md:text-7xl font-light text-stone-900 tracking-tight font-display">
              Featured <span className="italic font-normal">Collection</span>
            </h2>
          </div>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed font-body">
            Discover our handpicked selection of exceptional pieces, each chosen
            for its unique character and timeless appeal
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Product Card */}
              <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-stone-200/50">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-stone-900 text-white px-3 py-1 text-xs tracking-wider uppercase rounded-full shadow-lg">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <div
                    className={`absolute inset-0 transition-transform duration-700 ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>

                  {/* Overlay on Hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-stone-900/60 via-stone-900/0 to-transparent transition-opacity duration-500 ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`}
                  >
                    <div className="absolute bottom-6 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button className="bg-white text-stone-900 px-8 py-3 rounded-full font-medium text-sm tracking-wide hover:bg-stone-900 hover:text-white transition-all duration-300 shadow-xl">
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-light text-stone-900 tracking-wide group-hover:text-amber-800 transition-colors duration-300 font-body">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500 tracking-wide">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-2xl font-light text-stone-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full mt-4 py-3 bg-stone-900 text-white rounded-xl font-medium text-sm tracking-wider uppercase hover:bg-amber-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 text-stone-900 text-lg font-light hover:text-amber-800 transition-colors duration-300"
          >
            <button className="group inline-flex items-center gap-3 text-stone-900 text-lg font-light hover:text-amber-800 transition-colors duration-300">
              <span className="tracking-wide font-body">
                View Full Collection
              </span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
