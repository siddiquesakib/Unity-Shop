"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Store,
    User,
    Mail,
    Phone,
    Briefcase,
    MapPin,
    CreditCard,
    LayoutGrid,
    FileText,
    Loader2,
    CheckCircle2
} from "lucide-react";

export default function BecomeSellerPage() {
    const { user, submitSellerRequest } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        shopName: "",
        ownerName: user?.name || "",
        email: user?.email || "",
        phone: "",
        businessType: "individual",
        address: "",
        bankInfo: "",
        categories: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await submitSellerRequest(formData);

        setLoading(false);
        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                router.push("/dashboard/user");
            }, 3000);
        } else {
            setError(result.error || "Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center"
                >
                    <CheckCircle2 size={40} />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
                <p className="text-slate-400 text-center max-w-md">
                    Thank you for applying to become a seller on UnityShop. Our team will review your application and get back to you shortly.
                </p>
                <p className="text-indigo-400 text-sm animate-pulse">Redirecting you to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Become a Seller</h1>
                <p className="text-slate-400">Join our community and start reaching thousands of customers.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <Store size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Shop Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Shop Name</label>
                            <div className="relative group">
                                <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    required
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    placeholder="Enter your shop name"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Business Type</label>
                            <div className="relative group">
                                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none"
                                >
                                    <option value="individual" className="bg-slate-900">Individual</option>
                                    <option value="company" className="bg-slate-900">Company</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Shop Description</label>
                        <div className="relative group">
                            <FileText size={18} className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                            <textarea
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us a bit about what you plan to sell..."
                                rows={4}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Owner Info */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Owner Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    required
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    placeholder="Owner's full name"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    readOnly
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-500 outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Phone Number</label>
                            <div className="relative group">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Product Categories</label>
                            <div className="relative group">
                                <LayoutGrid size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    required
                                    name="categories"
                                    value={formData.categories}
                                    onChange={handleChange}
                                    placeholder="e.g. Electronics, Fashion, Home"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Business Address</label>
                        <div className="relative group">
                            <MapPin size={18} className="absolute left-3 top-3 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                            <textarea
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full physical business address"
                                rows={2}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Info */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Payment Information</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Bank or Mobile Banking Details</label>
                        <div className="relative group">
                            <CreditCard size={18} className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            <textarea
                                required
                                name="bankInfo"
                                value={formData.bankInfo}
                                onChange={handleChange}
                                placeholder="Bank Name, Account Number, Branch or Mobile Banking details..."
                                rows={3}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl text-rose-500 text-sm">
                        {error}
                    </div>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Submit Application
                            <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
