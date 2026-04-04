"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import {
  FiStar,
  FiShield,
  FiPackage,
  FiTruck,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PRODUCTS_PER_PAGE = 16;

export default function SellerStoreClient({ sellerName }) {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Products UI State
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSellerName =
    !sellerName || sellerName === "undefined" ? "UnityShop Seller" : sellerName;

  const [stats, setStats] = useState({
    rating: 4.8,
    reviews: 124,
    productsSold: Math.floor(Math.random() * 500) + 100,
    deliverySuccess: 98,
    responseTime: "< 2 hours",
  });

  const fetchSellerAndProducts = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch seller profile first
      const userRes = await fetch(
        `${API_URL}/users/seller/${encodeURIComponent(activeSellerName)}`,
      );

      if (!userRes.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      setSeller(userData);

      // 2. Fetch products with filters
      const params = new URLSearchParams();
      params.set("sellerName", activeSellerName);
      params.set("limit", PRODUCTS_PER_PAGE);
      params.set("page", currentPage);

      if (activeCategory !== "all") params.set("category", activeCategory);
      if (priceRange[0] > 0) params.set("priceMin", priceRange[0]);
      if (priceRange[1] < 5000) params.set("priceMax", priceRange[1]);
      if (onSaleOnly) params.set("onSale", "true");

      const prodRes = await fetch(
        `${API_URL}/products/search?${params.toString()}`,
      );
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
        setTotalPages(prodData.totalPages || 1);
        setTotalProducts(prodData.total || 0); // mapped correctly to 'total'
      }
    } catch (error) {
      console.error("Failed to fetch seller or products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSellerName, currentPage, activeCategory, priceRange, onSaleOnly]);

  useEffect(() => {
    fetchSellerAndProducts();
  }, [fetchSellerAndProducts]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, priceRange, onSaleOnly]);

  const handleCategoryChange = (val) => {
    setActiveCategory(val);
    setSidebarOpen(false);
  };

  const handleReset = () => {
    setActiveCategory("all");
    setPriceRange([0, 5000]);
    setOnSaleOnly(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex flex-col items-center justify-center pt-10 pb-24 text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiShield size={40} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4">
          Seller Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          We couldn't find a registered seller matching "
          {decodeURIComponent(activeSellerName)}". They may have changed their
          name or deactivated their account.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] pb-24">
      {/* Seller Profile Header */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-4xl font-black text-gray-400">
              {seller?.image ? (
                <Image
                  src={seller.image}
                  alt={seller?.name || "Seller"}
                  fill
                  className="object-cover"
                />
              ) : (
                seller?.name?.charAt(0)?.toUpperCase() || "S"
              )}
            </div>

            <div className="flex-1 mt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3 justify-center md:justify-start">
                <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
                  {seller?.name || "Verified Store"}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full w-max mx-auto md:mx-0">
                  <FiShield size={16} /> Trusted Seller
                </span>
              </div>
              {seller?.email && (
                <p className="text-gray-500 font-medium tracking-wide">
                  {seller.email}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 mt-8">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-black flex items-center gap-1.5 justify-center md:justify-start">
                    {stats.rating}{" "}
                    <FiStar
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                    Based on {stats.reviews} reviews
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-black flex items-center gap-1.5 justify-center md:justify-start">
                    <FiPackage size={20} className="text-blue-500" />{" "}
                    {stats.productsSold}+
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                    Successful Orders
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-black flex items-center gap-1.5 justify-center md:justify-start">
                    <FiTruck size={20} className="text-green-500" />{" "}
                    {stats.deliverySuccess}%
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                    On-Time Delivery
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-black flex items-center gap-1.5 justify-center md:justify-start">
                    <FiClock size={20} className="text-orange-500" />{" "}
                    {stats.responseTime}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                    Response Time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {/* Mobile filter trigger */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-black">Store Collection</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-black transition-all"
          >
            Filters
          </button>
        </div>

        <div className="flex gap-8 lg:gap-12">
          {/* Desktop Sidebar (Categories) */}
          <div className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl border border-gray-200 p-6">
              <ProductFilters
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onSaleOnly={onSaleOnly}
                setOnSaleOnly={setOnSaleOnly}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex flex-wrap items-center justify-between mb-8 pb-4">
              <h2 className="text-2xl font-black text-black">
                Store Collection
              </h2>
              <span className="px-4 py-1.5 bg-gray-100 text-black rounded-full font-bold text-sm">
                {totalProducts} Products
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-[#f7f6f3] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {activeCategory !== "all"
                    ? "This seller hasn't listed any items in this category yet."
                    : "This seller hasn't listed any items recently."}
                </p>
                {(activeCategory !== "all" ||
                  priceRange[0] > 0 ||
                  onSaleOnly) && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-full border border-gray-200 shadow-sm">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent text-gray-700 transition-colors"
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      <div className="flex px-2 gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                  currentPage === page
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100 text-gray-600"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className="w-10 h-10 flex items-center justify-center text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent text-gray-700 transition-colors"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display text-xl font-light text-black">
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ProductFilters
                activeCategory={activeCategory}
                setActiveCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onSaleOnly={onSaleOnly}
                setOnSaleOnly={setOnSaleOnly}
                onReset={handleReset}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
