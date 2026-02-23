"use client";

import { ShoppingBag, Truck, Tag, MessageSquare, ArrowRight, } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerOverview() {
    const panels = [
        {
            title: "Fulfillment Status",
            description: "Monitor platform-wide orders and shipping bottlenecks.",
            icon: Truck,
            stats: "128 Pending Shipments",
            color: "text-orange-400",
            bg: "bg-orange-500/10",
        },
        {
            title: "Promotions & Marketing",
            description: "Manage active coupons and platform spotlights.",
            icon: Tag,
            stats: "5 Active Campaigns",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            title: "Support Tickets",
            description: "Oversight of user inquiries and seller disputes.",
            icon: MessageSquare,
            stats: "12 Open Tickets",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {panels.map((panel, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${panel.bg}`}>
                            <panel.icon className={panel.color} size={24} />
                        </div>
                        <ArrowRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">{panel.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{panel.description}</p>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 w-fit">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${panel.color}`}>{panel.stats}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
