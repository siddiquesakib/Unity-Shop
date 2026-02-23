"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WishlistPreview() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/users/wishlist/${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 3));
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Wishlist</h3>
        <Link
          href="/dashboard/user/wishlist"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={32} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-400 text-sm">Your wishlist is empty</p>
          <p className="text-slate-500 text-xs mt-1">
            Save products you like by clicking the heart icon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 group hover:border-slate-700 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-slate-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 capitalize">
                  {product.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-indigo-400">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeFromWishlist(product._id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
