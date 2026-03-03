"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import AIProductPreview from "@/components/ai/AIProductPreview";
import {
  Plus,
  X,
  Info,
  DollarSign,
  Package,
  Tag as TagIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
  });

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.image
    ) {
      setError("Product name, category, price, and image are required.");
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        stock: formData.stock ? Number(formData.stock) : 0,
        image: formData.image,
        tags,
        badge: null,
        rating: 0,
        reviews: 0,
        sellerName: user?.name || "Unknown Seller",
        sellerEmail: user?.email || "",
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/seller");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={40} className="text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Published!
        </h2>
        <p className="text-gray-500">Your product is now live on UnityShop.</p>
        <p className="text-gray-400 text-sm mt-2">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to list a new product on UnityShop.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 transition-all font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Plus size={18} />
                Publish Product
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <section className="p-8 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="living">Home & Living</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="lighting">Lighting</option>
                    <option value="stationery">Stationery</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Sony, Apple"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Product Description
                </label>
                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product features, materials, and benefits..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Product Image */}
          <section className="p-8 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all placeholder:text-gray-400"
                />
              </div>

              {formData.image && (
                <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* AI Product Preview Button */}
              <div className="flex items-center gap-3 pt-2">
                <AIProductPreview
                  onImageGenerated={(enhancedImageUrl) => {
                    setFormData((prev) => ({
                      ...prev,
                      image: enhancedImageUrl,
                    }));
                  }}
                />
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles size={14} className="text-purple-500" />
                  Enhance your product image with AI
                </p>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-2">
                <AlertCircle size={14} />
                Paste a direct image URL or use AI to enhance one. Recommended:
                1200x1200px.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Pricing & Inventory */}
          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                <DollarSign size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Pricing & Inventory
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  />
                  <DollarSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Original Price ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="For sale items (optional)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  />
                  <DollarSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Stock Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  />
                  <Package
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                <TagIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Tags</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Product Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Press Enter to add tag"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Seller Info */}
          <section className="p-6 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Seller"}
                </p>
                <p className="text-xs text-gray-400">{user?.email || ""}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              This product will be listed under your seller account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
