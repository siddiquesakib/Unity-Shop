"use client";

import { motion } from "framer-motion";
import { TrendingUp, MoreVertical } from "lucide-react";

export default function PlatformChart() {
    // This is a mockup of a chart using divs for simplicity in UI design phase
    const data = [40, 70, 45, 90, 65, 80, 95, 75, 85, 100, 90, 110];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Platform Growth <TrendingUp size={18} className="text-emerald-400" />
                    </h3>
                    <p className="text-sm text-slate-500">Overall user & seller registration trends</p>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-6">
                {data.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${value}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 relative"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {value}%
                            </div>
                        </motion.div>
                        <span className="text-[10px] text-slate-500 font-medium">{months[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
