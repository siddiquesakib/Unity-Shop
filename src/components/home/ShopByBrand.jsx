// components/home/ShopByBrand.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiGrid } from "react-icons/fi";

const ShopByBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/brands`,
        );
        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        }
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (!loading && brands.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl m-4 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-block w-8 h-1 rounded-full bg-black" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
              Brands
            </span>
            <span className="inline-block w-8 h-1 rounded-full bg-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
            Shop by Brand
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse products from your favorite brands
          </p>
        </div>

        {/* Brand Grid */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 rounded-2xl aspect-square"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="group relative bg-white/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 hover:bg-white/60 hover:border-white/40 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center aspect-square"
              >
                {/* Brand image or initial */}
                {brand.image ? (
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white mb-3 ring-2 ring-gray-200 group-hover:ring-black transition-all">
                    <Image
                      src={
                        Array.isArray(brand.image)
                          ? brand.image[0]
                          : brand.image
                      }
                      alt={brand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold mb-3 group-hover:scale-110 transition-transform">
                    {brand.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-black transition-colors leading-tight">
                  {brand.name}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {brand.count} {brand.count === 1 ? "product" : "products"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByBrand;
