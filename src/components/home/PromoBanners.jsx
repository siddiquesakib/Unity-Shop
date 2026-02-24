// components/home/PromoBanners.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const PromoBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home/banners`,
        );
        if (res.ok) {
          const data = await res.json();
          setBanners(data);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (!loading && banners.length === 0) return null;

  // Use up to 3 banners: 1 large left + 2 stacked right
  const mainBanner = banners[0];
  const sideBanners = banners.slice(1, 3);

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-pulse bg-gray-100 rounded-2xl h-64" />
            <div className="grid grid-rows-2 gap-4">
              <div className="animate-pulse bg-gray-100 rounded-2xl" />
              <div className="animate-pulse bg-gray-100 rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main banner (large) */}
            {mainBanner && (
              <Link
                href={mainBanner.link || "/products"}
                className="group relative bg-black rounded-2xl p-8 sm:p-10 flex flex-col justify-end min-h-65 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10" />

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                    {mainBanner.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 max-w-xs">
                    {mainBanner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold bg-white text-black rounded-full group-hover:bg-gray-100 transition-colors">
                    {mainBanner.cta || "Shop Now"}{" "}
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )}

            {/* Side banners (stacked) */}
            <div className="grid grid-rows-2 gap-4">
              {sideBanners.map((banner, i) => (
                <Link
                  key={banner._id || i}
                  href={banner.link || "/products"}
                  className="group relative bg-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-end overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/50 rounded-full -mr-10 -mt-10" />

                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {banner.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-black group-hover:gap-2.5 transition-all">
                      {banner.cta || "Shop Now"}{" "}
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}

              {/* If only 1 side banner, show placeholder */}
              {sideBanners.length < 2 && (
                <Link
                  href="/products"
                  className="group relative bg-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-end overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/50 rounded-full -mr-10 -mt-10" />
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
                      Browse All
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Discover thousands of products
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-black group-hover:gap-2.5 transition-all">
                      Explore <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoBanners;
