"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Store } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold text-white">Welcome to Unity Dashboard</h1>
                <p className="text-slate-400 max-w-md">Select your dashboard view to get started.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <Link href="/dashboard/user" className="group">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 h-full flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                            <User size={32} className="text-indigo-400 group-hover:text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">User Dashboard</h2>
                            <p className="text-slate-400 text-sm">Track orders, manage wishlist, and view profile.</p>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/dashboard/seller" className="group">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-full flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                            <Store size={32} className="text-purple-400 group-hover:text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Seller Dashboard</h2>
                            <p className="text-slate-400 text-sm">Manage products, view sales stats, and process orders.</p>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
