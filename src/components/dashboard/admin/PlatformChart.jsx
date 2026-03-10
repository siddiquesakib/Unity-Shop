"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MoreVertical, Loader2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function PlatformChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("orders"); // orders | revenue | newUsers

  useEffect(() => {
    fetch(`${API_BASE}/orders/admin-monthly-stats`)
      .then((res) => res.json())
      .then((d) => {
        setMonthlyData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch monthly stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200 flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  // Get values based on view mode
  const values = monthlyData.map((m) => {
    if (viewMode === "revenue") return m.revenue;
    if (viewMode === "newUsers") return m.newUsers;
    return m.orders;
  });
  const maxValue = Math.max(...values, 1);
  const months = monthlyData.map((m) => m.label);

  const modeLabels = {
    orders: "Orders",
    revenue: "Revenue ($)",
    newUsers: "New Users",
  };

  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 flex flex-col h-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl font-black text-black tracking-tight uppercase flex items-center gap-3">
            Metric <span className="text-gray-300">Analyzer</span> <TrendingUp size={22} className="text-gray-200" />
          </h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
            12-Month Comparative Synopsis
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-sm transition-all duration-300 group-hover:bg-white">
          {["orders", "revenue", "newUsers"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === mode
                  ? "bg-black text-white shadow-xl shadow-black/20"
                  : "text-gray-400 hover:text-black hover:bg-gray-100"
                }`}
            >
              {mode === "newUsers"
                ? "Users"
                : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-6">
        {values.map((value, index) => {
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end"
            >
              <div className="relative w-full flex flex-col items-center group-hover/bar:-translate-y-1 transition-transform duration-500">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ duration: 1.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full max-w-[32px] rounded-full bg-gradient-to-t from-gray-50 to-gray-200 group-hover/bar:from-black group-hover/bar:to-gray-800 transition-all duration-500 relative shadow-sm group-hover/bar:shadow-xl group-hover/bar:shadow-black/20"
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-black text-[10px] font-black text-white opacity-0 group-hover/bar:opacity-100 transition-all duration-500 whitespace-nowrap shadow-2xl scale-50 group-hover/bar:scale-100">
                    {viewMode === "revenue"
                      ? `$${value.toLocaleString()}`
                      : value}
                  </div>
                </motion.div>
              </div>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter group-hover/bar:text-black transition-colors duration-500">
                {months[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>

  );
}
