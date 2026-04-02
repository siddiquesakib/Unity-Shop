"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function GrowthChart({ data, loading }) {
    const [metric, setMetric] = useState("orders");

    if (loading) {
        return (
            <div className="p-6 rounded-3xl bg-white border border-gray-200 h-[450px] animate-pulse">
                <div className="h-6 w-48 bg-gray-100 rounded mb-8"></div>
                <div className="h-[300px] w-full bg-gray-50 rounded-2xl"></div>
            </div>
        );
    }

    const metricColors = {
        orders: "#000000",
        revenue: "#000000",
        users: "#000000"
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white p-3 rounded-xl border border-gray-800 shadow-2xl">
                    <p className="text-xs font-bold mb-1">{label}</p>
                    <p className="text-sm">
                        {metric === "revenue" ? `$${payload[0].value.toLocaleString()}` : payload[0].value.toLocaleString()}
                        <span className="text-[10px] text-gray-400 ml-1 ml-1 uppercase">{metric}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 flex flex-col h-[450px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-2xl font-black text-black tracking-tight uppercase">
                        Market <span className="text-gray-300">Momentum</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Annual Performance Projection</p>
                </div>

                <div className="flex items-center p-1.5 bg-gray-50 rounded-2xl self-start md:self-center border border-gray-100 shadow-sm">
                    {["orders", "revenue", "users"].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMetric(m)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${metric === m
                                ? "bg-black text-white shadow-xl shadow-black/20"
                                : "text-gray-400 hover:text-black hover:bg-white"
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={metric}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#d1d5db', fontSize: 10, fontWeight: 800 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#d1d5db', fontSize: 10, fontWeight: 800 }}
                                    tickFormatter={(val) => metric === "revenue" ? `$${val > 999 ? (val / 1000).toFixed(1) + 'k' : val}` : val}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={metric}
                                    stroke="#000000"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                    animationDuration={2000}
                                    activeDot={{ r: 6, fill: "#000000", stroke: "#ffffff", strokeWidth: 3 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    );
}
