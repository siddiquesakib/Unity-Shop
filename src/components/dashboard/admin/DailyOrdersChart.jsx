"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function DailyOrdersChart({ data, loading }) {
    if (loading) {
        return (
            <div className="p-6 rounded-3xl bg-white border border-gray-200 h-[250px] animate-pulse">
                <div className="h-5 w-40 bg-gray-100 rounded mb-6"></div>
                <div className="h-[150px] w-full bg-gray-50 rounded-xl"></div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white px-3 py-2 rounded-lg border border-gray-800 shadow-xl">
                    <p className="text-[10px] font-bold text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-black">
                        {payload[0].value} <span className="text-[10px] uppercase ml-1">Orders</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 flex flex-col h-[300px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
            <div className="mb-8">
                <h3 className="text-xl font-black text-black tracking-tight uppercase">
                    Daily <span className="text-gray-300">Volume</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">30-Day Velocity Matrix</p>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f5f5f5" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#d1d5db', fontSize: 9, fontWeight: 800 }}
                            interval={5}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#000000"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{ r: 6, fill: "#000000", stroke: "#ffffff", strokeWidth: 3 }}
                            animationDuration={2500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

    );
}
