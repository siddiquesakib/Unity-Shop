"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Clock, CreditCard, TrendingUp } from "lucide-react";

export default function UserStats() {
    const stats = [
        { label: "Total Orders", value: "24", icon: ShoppingBag, color: "from-blue-500 to-cyan-400" },
        { label: "Pending", value: "3", icon: Clock, color: "from-amber-500 to-orange-400" },
        { label: "Total Spent", value: "$1,240", icon: CreditCard, color: "from-emerald-500 to-teal-400" },
        { label: "Points", value: "450", icon: TrendingUp, color: "from-purple-500 to-pink-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <stat.icon size={64} className="text-white" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
