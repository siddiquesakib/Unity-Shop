"use client";

import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  const roleLabels = {
    user: "Customer",
    seller: "Seller",
    admin: "Administrator",
    manager: "Manager",
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/40">
      <div className="h-16 px-4 pl-16 lg:pl-6 pr-4 lg:pr-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/60 px-4 py-2 rounded-xl w-80 focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600 w-full"
          />
        </div>

        {/* Mobile search button */}
        <button className="md:hidden p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <Search size={18} />
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800/40 text-slate-500 hover:text-white hover:border-slate-700/60 transition-all duration-200">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
          </button>

          <div className="h-6 w-px bg-slate-800/60 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {roleLabels[user?.role] || "Customer"}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-0.5 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full rounded-[10px] object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
