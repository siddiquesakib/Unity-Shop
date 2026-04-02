"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Plus, Search, Trash } from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";

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
      className="bg-white border border-gray-200 rounded-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">My Products</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <Button
            href="/dashboard/seller/add-product" 
          >
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {products.length === 0
              ? "You haven't added any products yet."
              : "No products match your search."}
          </p>
          {products.length === 0 && (
            <Button
              href="/dashboard/seller/add-product"
              className="!px-6 !py-2.5 !rounded-xl !font-medium inline-block text-center"
              showIcon={false}
            >
              Add Your First Product
            </Button>
          )}
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
                  className="group hover:bg-gray-100/30 transition-colors"
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
                          <div className="w-5 h-5 rounded bg-gray-200" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500 capitalize">
                    {product.category}
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
                  <td className="py-4 text-sm text-amber-500">
                    ⭐ {product.rating || 0}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
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
