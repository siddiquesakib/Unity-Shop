"use client";

import { motion } from "framer-motion";
import {
    ShoppingBag,
    DollarSign,
    Users,
    TrendingUp,
    Award,
    ShieldCheck
} from "lucide-react";

export default function StatsGrid({ data, loading }) {
    const stats = [
        {
            title: "Total Users",
            value: data?.totalUsers?.toLocaleString() || "0",
            icon: Users,
            description: "Registered platform users"
        },
        {
            title: "Total Sellers",
            value: data?.totalSellers?.toLocaleString() || "0",
            icon: ShieldCheck,
            description: "Verified trade partners"
        },
        {
            title: "Total Orders",
            value: data?.totalOrders?.toLocaleString() || "0",
            icon: ShoppingBag,
            description: "Lifetime transaction volume"
        },
        {
            title: "Total Revenue",
            value: `$${data?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
            icon: DollarSign,
            description: "Gross platform intake"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-40 rounded-[2rem] bg-gray-50 animate-pulse border border-gray-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1]
                    }}
                    whileHover={{
                        y: -10,
                        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.08)",
                        borderColor: "rgba(0,0,0,1)"
                    }}
                    className="p-8 rounded-[2rem] bg-white border border-gray-100 transition-all duration-500 group cursor-default relative overflow-hidden h-full"
                >
                    <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-black/20">
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div className="h-2 w-2 rounded-full bg-black/10 group-hover:bg-black group-hover:scale-150 transition-all duration-500"></div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2 group-hover:text-gray-500 transition-colors">
                            {stat.title}
                        </p>
                        <h3 className="text-3xl font-black text-black tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left">
                            {stat.value}
                        </h3>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                            {stat.description}
                        </p>
                    </div>

                    {/* Subtle decoration */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 group-hover:bg-black/5 transition-all duration-700 ease-out"></div>
                </motion.div>
            ))}
        </div>
    );
}
