"use client";

import { Users, Store, DollarSign, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminStats() {
    const stats = [
        {
            title: "Total Revenue",
            value: "$524,890.00",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            title: "Active Users",
            value: "12,450",
            change: "+18.2%",
            isPositive: true,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        {
            title: "Active Sellers",
            value: "842",
            change: "+4.1%",
            isPositive: true,
            icon: Store,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Pending Verifications",
            value: "24",
            change: "-2",
            isPositive: false,
            icon: UserCheck,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stat.change}
                            {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
