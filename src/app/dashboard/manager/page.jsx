"use client";

import ManagerOverview from "@/components/dashboard/manager/ManagerOverview";
import { Briefcase, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Manager Hub</h1>
                    <p className="text-slate-400">Operations, marketing oversight, and fulfillment tracking.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                    <span>Shift Status:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">Active Management</span>
                </div>
            </div>

            {/* Manager Panels */}
            <ManagerOverview />

            {/* Operational Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fulfillment Efficiency */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ShoppingCart size={18} className="text-indigo-400" />
                        Fulfillment Efficiency
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: "Processing Orders", current: 85, color: "bg-indigo-500" },
                            { label: "In-Transit", current: 62, color: "bg-purple-500" },
                            { label: "Delivered (Today)", current: 94, color: "bg-emerald-500" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="text-white font-medium">{item.current}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.current}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Summary */}
                <div className="p-6 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/10 flex flex-col justify-between overflow-hidden relative group">
                    <TrendingUp size={120} className="absolute -bottom-4 -right-4 text-indigo-500/50 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-2">Platform Summary</h3>
                        <p className="text-indigo-100/70 text-sm">Daily performance overview for management review.</p>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
                            <span className="text-sm text-indigo-100">Daily Sales</span>
                            <span className="text-lg font-bold text-white">$12,450</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-indigo-500/50 pb-2">
                            <span className="text-sm text-indigo-100">New Users</span>
                            <span className="text-lg font-bold text-white">+48</span>
                        </div>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                            Download Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
