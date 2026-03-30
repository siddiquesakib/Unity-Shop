"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [viewMode, setViewMode] = useState("orders");

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

  if (loading) {
    return (
      <div className="p-10 rounded-[2.5rem] bg-white border h-[450px] animate-pulse">
        <div className="h-6 w-48 bg-gray-100 rounded mb-8"></div>
        <div className="h-[300px] w-full bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-3 rounded-xl shadow-lg">
          <p className="text-xs font-bold">{label}</p>
          <p className="text-sm">
            {viewMode === "revenue"
              ? `$${payload[0].value}`
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const safeData = chartData.map((d) => ({
    ...d,
    users: d.users || 0,
  }));

  return (
    <div className="p-6 sm:p-10 rounded-[2.5rem] bg-white border flex flex-col h-[450px] shadow-sm">

     {/* HEADER */}
<div className="flex flex-col gap-4 mb-6">

  {/* TEXT TOP */}
  <div>
    <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
      Sales Analytics <TrendingUp size={20} />
    </h3>
    <p className="text-xs text-gray-400 mt-1">
      Last 7 days performance
    </p>
  </div>

  {/* BUTTONS BELOW */}
  <div className="w-full">
    <div className="flex flex-wrap md:flex-nowrap bg-gray-100 rounded-2xl p-1 gap-1 w-full sm:w-fit">

      {["orders", "revenue", "users"].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer ${
            viewMode === mode
              ? "bg-black text-white shadow-md"
              : "text-gray-500 hover:text-black hover:bg-white"
          }`}
        >
          {mode}
        </button>
      ))}

    </div>
  </div>

</div>

      {/* CHART */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safeData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey={viewMode}
                  stroke="#000"
                  strokeWidth={2}
                  fill="url(#colorMetric)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}