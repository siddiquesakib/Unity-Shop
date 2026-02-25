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
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
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
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Platform Growth{" "}
            <TrendingUp size={18} className="text-emerald-400" />
          </h3>
          <p className="text-sm text-slate-500">
            Last 12 months — {modeLabels[viewMode]}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
          {["orders", "revenue", "newUsers"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === mode
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {mode === "newUsers"
                ? "Users"
                : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-6">
        {values.map((value, index) => {
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-3 group"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 2)}%` }}
                transition={{ duration: 1, delay: index * 0.05 }}
                className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 relative"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {viewMode === "revenue"
                    ? `$${value.toLocaleString()}`
                    : value}
                </div>
              </motion.div>
              <span className="text-[10px] text-slate-500 font-medium">
                {months[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
