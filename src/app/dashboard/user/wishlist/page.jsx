"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Heart, Trash2, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/users/wishlist/${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user?.email]);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE}/users/wishlist/${encodeURIComponent(user.email)}/${productId}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
          <p className="text-slate-400">
            Products you've saved for later. {products.length} item
            {products.length !== 1 ? "s" : ""} saved.
          </p>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search your wishlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </motion.div>

      {/* Wishlist Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center py-16">
            <Heart size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400 text-lg mb-2">
              {products.length === 0
                ? "Your wishlist is empty"
                : "No items match your search"}
            </p>
            <p className="text-slate-500 text-sm mb-6">
              {products.length === 0
                ? "Browse products and save your favorites by clicking the heart icon."
                : "Try adjusting your search."}
            </p>
            {products.length === 0 && (
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition font-medium"
              >
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-slate-700" />
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-xs text-slate-500 capitalize mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-white font-semibold mb-2 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-indigo-400">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-sm text-slate-500 line-through">
                          ${Number(product.originalPrice).toFixed(2)}
                        </span>
                      )}
                  </div>

                  {product.sellerName && (
                    <p className="text-xs text-slate-500 mb-3">
                      Sold by: {product.sellerName}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={14} />
                      View Product
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
