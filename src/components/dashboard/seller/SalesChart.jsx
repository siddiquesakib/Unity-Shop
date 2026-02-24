"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function SalesChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${API_BASE}/orders/seller-stats?sellerEmail=${encodeURIComponent(user.email)}`,
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

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

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
          <p className="text-sm text-slate-400">
            Revenue performance this week
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 w-full pb-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-[200px] rounded-xl bg-slate-800/40 animate-pulse" />
              <div className="h-3 w-8 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 w-full pb-4">
          {chartData.map((item, i) => {
            const heightPercent =
              maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 flex-1 group"
              >
                <div className="w-full relative h-[200px] flex items-end justify-center rounded-xl bg-slate-800/20 overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.max(heightPercent, 2)}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="w-full mx-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity relative"
                  >
                    {item.revenue > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${item.revenue.toFixed(0)}
                      </div>
                    )}
                  </motion.div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                    {item.day}
                  </span>
                  {item.orders > 0 && (
                    <p className="text-[10px] text-slate-600">
                      {item.orders} order{item.orders > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && chartData.every((d) => d.revenue === 0) && (
        <div className="text-center py-4">
          <p className="text-slate-500 text-sm">No sales data this week yet.</p>
        </div>
      )}
    </motion.div>
  );
}
