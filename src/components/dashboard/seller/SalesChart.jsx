"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function SalesChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(
          `${API_BASE}/orders/seller-stats?sellerEmail=${encodeURIComponent(user.email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setChartData(data.last7Days || []);
        }
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.email]);

  const [viewMode, setViewMode] = useState("revenue"); // revenue or orders

  const maxVal = Math.max(...chartData.map((d) => viewMode === "revenue" ? d.revenue : d.orders), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-10 rounded-[2.5rem] bg-white border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] group/card flex flex-col min-h-[450px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h3 className="text-2xl font-black text-black tracking-tight uppercase flex items-center gap-3">
            Sales <span className="text-gray-300">Analytics</span> <TrendingUp size={22} className="text-gray-200" />
          </h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
            7-Day Performance Metric
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {["revenue", "orders"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === mode
                ? "bg-black text-white shadow-xl shadow-black/20"
                : "text-gray-400 hover:text-black hover:bg-gray-100"
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-6 h-full">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 flex-1 h-full justify-end">
              <div className="w-full h-2/3 bg-gray-50 rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-6 h-full">
          {chartData.map((item, i) => {
            const val = viewMode === "revenue" ? item.revenue : item.orders;
            const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-4 flex-1 group/bar h-full justify-end"
              >
                <div className="relative w-full flex flex-col items-center group-hover/bar:-translate-y-1 transition-transform duration-500">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.max(heightPercent, 2)}%`,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-full max-w-[40px] rounded-full bg-gradient-to-t from-gray-50 to-gray-200 group-hover/bar:from-black group-hover/bar:to-gray-800 transition-all duration-500 relative shadow-sm group-hover/bar:shadow-xl group-hover/bar:shadow-black/20"
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-black text-[10px] font-black text-white opacity-0 group-hover/bar:opacity-100 transition-all duration-500 whitespace-nowrap shadow-2xl scale-50 group-hover/bar:scale-100">
                      {viewMode === "revenue" ? `$${val.toFixed(0)}` : val}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter group-hover/bar:text-black transition-colors duration-500">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!loading && chartData.every((d) => (viewMode === "revenue" ? d.revenue : d.orders) === 0) && (
        <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Meta-Data Recorded</p>
        </div>
      )}
    </motion.div>
  );
}
