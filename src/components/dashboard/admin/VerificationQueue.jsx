"use client";

import { Check, X, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function VerificationQueue() {
    const applications = [
        {
            id: "APP-001",
            name: "Luxe Furnishings",
            owner: "Sarah Miller",
            category: "Home & Decor",
            date: "2024-02-20",
            status: "Pending",
        },
        {
            id: "APP-002",
            name: "TechNova Systems",
            owner: "James Wilson",
            category: "Electronics",
            date: "2024-02-21",
            status: "Pending",
        },
        {
            id: "APP-003",
            name: "Urban Style Co.",
            owner: "Emma Davis",
            category: "Fashion",
            date: "2024-02-19",
            status: "Pending",
        },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Verification Queue</h3>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                    {applications.length} Pending
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {applications.map((app, index) => (
                            <motion.tr
                                key={app.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-white">{app.name}</p>
                                        <p className="text-xs text-slate-500">{app.category}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">{app.owner}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{app.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                                            <Check size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-950/30 border-t border-slate-800 text-center">
                <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    View All Applications
                </button>
            </div>
        </div>
    );
}
