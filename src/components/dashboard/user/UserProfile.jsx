"use client";

import { motion } from "framer-motion";
import { User, MapPin, Mail, Phone, Edit2 } from "lucide-react";

export default function UserProfile() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">My Profile</h3>
                <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <Edit2 size={16} />
                </button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                        {/* Mock Avatar */}
                        <User size={40} className="text-slate-400" />
                    </div>
                </div>
                <h4 className="text-xl font-bold text-white">Alex Johnson</h4>
                <p className="text-slate-400 text-sm">Member since 2024</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Mail size={16} />
                    </div>
                    <span className="text-sm">alex.johnson@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Phone size={16} />
                    </div>
                    <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <MapPin size={16} />
                    </div>
                    <span className="text-sm truncate">123 Tech Street, Silicon Valley, CA</span>
                </div>
            </div>
        </motion.div>
    );
}
