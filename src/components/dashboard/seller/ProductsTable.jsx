"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Plus, Search, Trash } from "lucide-react";
import Link from "next/link";

export default function ProductsTable() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?sellerEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user?.email]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-white">My Products</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <Link
            href="/dashboard/seller/add-product"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">
            {products.length === 0
              ? "You haven't added any products yet."
              : "No products match your search."}
          </p>
          {products.length === 0 && (
            <Link
              href="/dashboard/seller/add-product"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition font-medium inline-block"
            >
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-800">
                <th className="pb-4 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <div className="w-5 h-5 rounded bg-slate-700" />
                        </div>
                      )}
                      <span className="font-medium text-white truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-400 capitalize">
                    {product.category}
                  </td>
                  <td className="py-4 text-sm font-semibold text-emerald-400">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (product.stock || 0) > 10
                          ? "bg-emerald-500/10 text-emerald-400"
                          : (product.stock || 0) > 0
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {(product.stock || 0) > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-yellow-400">
                    ⭐ {product.rating || 0}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
