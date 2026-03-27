"use client";

import { useState, useEffect } from "react";
import StatsGrid from "./StatsGrid";
import GrowthChart from "./GrowthChart";
import DailyOrdersChart from "./DailyOrdersChart";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export default function AdminAnalytics() {
    const [overviewData, setOverviewData] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    setOverviewData(null);
                    setGrowthData([]);
                    setDailyData([]);
                    return;
                }

                const [platformRes, monthlyRes] = await Promise.all([
                    axios.get(`${API_BASE}/orders/platform-stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_BASE}/orders/admin-monthly-stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const platform = platformRes.data || {};
                const monthly = Array.isArray(monthlyRes.data) ? monthlyRes.data : [];
                const daily = Array.isArray(platform.last7Days)
                    ? platform.last7Days.map((d) => ({ date: d.day || d.date, count: d.orders || 0 }))
                    : [];

                setOverviewData(platform);
                setGrowthData(monthly);
                setDailyData(daily);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                setOverviewData(null);
                setGrowthData([]);
                setDailyData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="space-y-8 py-4">
            {/* 5 Statistic Cards */}
            <StatsGrid data={overviewData} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Platform Growth Chart - Takes 2/3 space on large screens */}
                <div className="lg:col-span-2">
                    <GrowthChart data={growthData} loading={loading} />
                </div>

                {/* Daily Orders Chart - Takes 1/3 space on large screens */}
                <div className="lg:col-span-1 flex flex-col gap-10">
                    <DailyOrdersChart data={dailyData} loading={loading} />

                    {/* Top Selling Products List Card */}
                    <div className="flex-1 p-10 rounded-[2.5rem] bg-black text-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group/top">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-8 flex items-center justify-between tracking-tight uppercase">
                                Elite <span className="text-gray-500">Performers</span>
                                <span className="text-[10px] bg-white text-black px-3 py-1 rounded-full font-black tracking-widest">TOP 5</span>
                            </h3>

                            {loading ? (
                                <div className="space-y-6">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : overviewData?.topSellingProducts?.length > 0 ? (
                                <div className="space-y-4">
                                    {overviewData.topSellingProducts.map((product, i) => (
                                        <div key={i} className="flex items-center justify-between group/row p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black border border-white/10 group-hover/row:bg-white group-hover/row:text-black transition-all duration-500 shadow-lg shadow-black/50">
                                                    0{i + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black truncate max-w-[140px] group-hover/row:translate-x-1 transition-transform duration-500">{product._id}</span>
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verified Asset</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black bg-white/10 px-4 py-1.5 rounded-xl border border-white/5 group-hover/row:bg-black group-hover/row:border-white transition-all duration-500 shadow-inner">
                                                    {product.sales} <span className="text-[9px] text-gray-500 ml-1">UNITS</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] border-2 border-dashed border-white/5 rounded-[2rem]">
                                    Awaiting Market Activity
                                </div>
                            )}
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover/top:bg-white/10 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}
