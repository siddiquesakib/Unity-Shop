"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
} from "lucide-react";
import Image from "next/image";

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
    stock: "1",
    image: "",
    endAt: "",
  });

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false); // AI description state

  // Auction stock fix
  useEffect(() => {
    if (formData.category === "auction") {
      setFormData((prev) => ({ ...prev, stock: "1" }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "originalPrice") {
      if (value !== "" && Number(value) < 0) return;
    }

    if (name === "stock") {
      if (formData.category === "auction") return;
      if (value !== "" && Number(value) < 1) {
        setFormData((prev) => ({ ...prev, [name]: "1" }));
        return;
      }
    }

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

    const isAuction = formData.category === "auction";
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.image ||
      (isAuction && !formData.endAt)
    ) {
      setError(
        isAuction
          ? "Product name, category, price, image, and auction end date are required."
          : "Product name, category, price, and image are required.",
      );
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
        stock: isAuction ? 1 : formData.stock ? Number(formData.stock) : 1,
        image: formData.image,
        tags,
        badge: isAuction ? "Auction" : null,
        rating: 0,
        reviews: 0,
        sellerName: user?.name || "Unknown Seller",
        sellerEmail: user?.email || "",
        endAt: isAuction ? formData.endAt : null,
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

  // AI Description Generation
  const generateDescription = async () => {
    if (!formData.name) {
      setError("Please enter a product name first");
      return;
    }

    setIsGeneratingDesc(true);
    setError("");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            price: formData.price,
            imageUrl: formData.image,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle rate limit specifically
        if (res.status === 429) {
          setError(
            "AI service is busy (rate limit). Please try again in a few minutes.",
          );
          // Optionally set a fallback description
          setFormData((prev) => ({
            ...prev,
            description: `${prev.name} – a high-quality product from our collection. Perfect for your needs.`,
          }));
        } else {
          throw new Error(data.error || "Generation failed");
        }
        return;
      }

      setFormData((prev) => ({ ...prev, description: data.description }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGeneratingDesc(false);
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
            Fill in the details below to list a new product.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Plus size={18} /> Publish Product
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
                  placeholder="Product Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-300 outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none cursor-pointer"
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
                    <option value="auction">Auction</option>
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
                    placeholder="Brand Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={isGeneratingDesc || !formData.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingDesc ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product features, materials, and benefits... or click 'Generate with AI' to auto-write a description."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          <section className="p-8 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
            </div>
            <div className="space-y-4">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
              />
              {formData.image && (
                <Image
                  src={formData.image}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-xl border"
                />
              )}
              <AIProductPreview
                onImageGenerated={(url) =>
                  setFormData((prev) => ({ ...prev, image: url }))
                }
              />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
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
                  {formData.category === "auction"
                    ? "Starting Bid ($)"
                    : "Price ($)"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <DollarSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <AnimatePresence>
                {formData.category === "auction" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={14} /> Auction End Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="endAt"
                        value={formData.endAt}
                        onChange={handleChange}
                        className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Stock Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="stock"
                    min="1"
                    value={formData.stock}
                    onChange={handleChange}
                    readOnly={formData.category === "auction"}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200 ${formData.category === "auction" ? "opacity-60 cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
                  />
                  <Package
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {formData.category === "auction" && (
                  <p className="text-[10px] text-amber-600 font-medium">
                    * Auction stock is fixed to 1.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                <TagIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Tags</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-xs border border-gray-200"
                  >
                    {tag}{" "}
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
                placeholder="Add tag..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
