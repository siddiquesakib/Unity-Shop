"use client";

import AdminStats from "@/components/dashboard/admin/AdminStats";
import PlatformChart from "@/components/dashboard/admin/PlatformChart";
import VerificationQueue from "@/components/dashboard/admin/VerificationQueue";
import { Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="text-emerald-400" size={20} />
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">System Administrator</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Admin Control Center</h1>
                    <p className="text-slate-400">Platform-wide overview, user management, and system health.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-300">System Status: Optimal</span>
                </div>
            </div>

            {/* Stats Section */}
            <AdminStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlatformChart />
                <VerificationQueue />
            </div>

            {/* Bottom Section - System Logs Placeholder */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-indigo-400" />
                        System Health & Security
                    </h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                                    <Activity size={18} className="text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Database Backup Completed</p>
                                    <p className="text-xs text-slate-500">Automated daily backup finished successfully.</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
