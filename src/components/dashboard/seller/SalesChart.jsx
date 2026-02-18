"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function SalesChart() {
    const data = [45, 60, 35, 70, 50, 80, 65];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 size={20} className="text-indigo-400" />
                        Weekly Sales
                    </h3>
                    <p className="text-sm text-slate-400">Revenue performance this week</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 w-full pb-4">
                {data.map((value, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="w-full relative h-[200px] flex items-end justify-center rounded-xl bg-slate-800/20 overflow-hidden">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                className="w-full mx-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">{days[i]}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
