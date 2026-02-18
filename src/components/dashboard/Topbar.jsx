"use client";

import { Bell, Search, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-8 flex items-center justify-between">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-2.5 rounded-full w-96 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for orders, products..."
                    className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <button className="relative p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Alex Johnson</p>
                        <p className="text-xs text-slate-500">Premium Member</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5"
                    >
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </header>
    );
}
