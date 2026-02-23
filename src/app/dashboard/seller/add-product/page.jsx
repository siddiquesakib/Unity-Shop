"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    Plus,
    X,
    Info,
    DollarSign,
    Package,
    Tag as TagIcon,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function AddProductPage() {
    const [tags, setTags] = useState(["Electronics", "Gadget"]);
    const [inputValue, setInputValue] = useState("");

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

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
                    <p className="text-slate-400 mt-1">Fill in the details below to list a new product on UnityShop.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-900 transition-all font-medium">
                        Save Draft
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all font-bold flex items-center gap-2">
                        <Plus size={18} />
                        Publish Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Core Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Information */}
                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Info size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Category</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all focus:bg-slate-950 appearance-none cursor-pointer">
                                        <option value="">Select Category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="home">Home & Decor</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Brand Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sony, Apple"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Product Description</label>
                                <textarea
                                    rows={6}
                                    placeholder="Describe your product features, materials, and benefits..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Media Upload Mockup */}
                    <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Product Media</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 md:col-span-2 aspect-video md:aspect-auto md:h-48 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 cursor-pointer transition-all group">
                                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                                    <Upload size={24} className="text-slate-500 group-hover:text-indigo-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-300">Main Image</p>
                                    <p className="text-xs text-slate-500">Click to upload</p>
                                </div>
                            </div>

                            {[1, 2].map((i) => (
                                <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 cursor-pointer transition-all group">
                                    <Plus size={20} className="text-slate-600 group-hover:text-indigo-400" />
                                    <span className="text-[10px] text-slate-500">Add Image</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Recommended size: 1200x1200px. Max 5MB per image.
                        </p>
                    </section>

                </div>

                {/* Right Column: Pricing & Meta */}
                <div className="space-y-8">

                    {/* Pricing & Inventory */}
                    <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <DollarSign size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Inventory</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Price ($)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                                    />
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Quantity</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="e.g. 50"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                                    />
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-400">Track Inventory</span>
                                <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tags & SEO */}
                    <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                <TagIcon size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Tags & SEO</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Tags</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tags.map((tag) => (
                                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-white">
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
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-xs font-medium text-slate-300">SEO Strength: High</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-emerald-500"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
