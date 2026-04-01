"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Package, AlertTriangle, Loader2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unityshop-server.onrender.com";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setShowConfirm(null);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerEmail?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package size={20} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">All Products</h3>
            <p className="text-sm text-gray-500">
              {products.length} total products
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, category, or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500">Loading products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {products.length === 0
              ? "No products found."
              : "No products match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-4 pl-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Seller
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package size={16} className="text-gray-300" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500 capitalize">
                    {product.category || "—"}
                  </td>
                  <td className="py-4 text-sm font-semibold text-emerald-600">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (product.stock || 0) > 10
                          ? "bg-emerald-50 text-emerald-600"
                          : (product.stock || 0) > 0
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-500"
                      }`}
                    >
                      {(product.stock || 0) > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500 truncate max-w-[150px]">
                    {product.sellerEmail || "—"}
                  </td>
                  <td className="py-4 text-sm text-amber-500">
                    ⭐ {product.rating || 0}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    {showConfirm === product._id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {deletingId === product._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirm(product._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Click the <strong>Delete</strong> button next to the product to
            permanently remove it. This action cannot be undone.
          </p>
        </div>
      )}
    </motion.div>
  );
}
