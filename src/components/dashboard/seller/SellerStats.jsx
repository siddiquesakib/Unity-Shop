"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";

export default function SellerStats() {
    const stats = [
        { label: "Total Revenue", value: "$48,256", change: "+12.5%", isPositive: true, icon: DollarSign, color: "from-emerald-500 to-teal-400" },
        { label: "Total Sales", value: "1,205", change: "+8.2%", isPositive: true, icon: ShoppingBag, color: "from-blue-500 to-cyan-400" },
        { label: "Total Products", value: "48", change: "-2.4%", isPositive: false, icon: Package, color: "from-purple-500 to-pink-400" },
        { label: "Conversion", value: "3.2%", change: "+4.1%", isPositive: true, icon: TrendingUp, color: "from-amber-500 to-orange-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hovered:border-slate-700 transition-all duration-300"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon size={24} className="text-white" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
