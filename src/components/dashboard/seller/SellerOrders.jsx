"use client";

import { motion } from "framer-motion";
import { Eye, Truck, XCircle, CheckCircle } from "lucide-react";

export default function SellerOrders() {
    const orders = [
        { id: "#ORD-7752", customer: "Alex Johnson", date: "Feb 18, 2026", total: "$120.50", status: "New", items: 3 },
        { id: "#ORD-7751", customer: "Maria Garcia", date: "Feb 15, 2026", total: "$85.00", status: "Processing", items: 1 },
        { id: "#ORD-7750", customer: "James Smith", date: "Feb 12, 2026", total: "$230.00", status: "Shipped", items: 4 },
        { id: "#ORD-7749", customer: "Sarah Wilson", date: "Feb 10, 2026", total: "$54.00", status: "Delivered", items: 2 },
        { id: "#ORD-7748", customer: "Michael Brown", date: "Feb 09, 2026", total: "$15.00", status: "Cancelled", items: 1 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "New": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "Processing": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "Shipped": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All Orders</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-800">
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {orders.map((order, i) => (
                            <tr key={i} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="py-4 text-sm font-medium text-white">{order.id}</td>
                                <td className="py-4 text-sm text-slate-400">{order.customer}</td>
                                <td className="py-4 text-sm font-semibold text-white">{order.total}</td>
                                <td className="py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button title="View Details" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        {order.status === "New" && (
                                            <button title="Process Order" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        {order.status === "Processing" && (
                                            <button title="Mark Shipped" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition-colors">
                                                <Truck size={16} />
                                            </button>
                                        )}
                                        <button title="Cancel Order" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors">
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
