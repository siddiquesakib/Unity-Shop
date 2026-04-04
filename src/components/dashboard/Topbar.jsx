"use client";

import { Bell, Search, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  const roleLabels = {
    user: "Customer",
    seller: "Seller",
    admin: "Administrator",
    manager: "Manager",
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 bg-transparent rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <Menu size={24} />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              {roleLabels[user?.role] || "Customer"}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-xl bg-black p-0.5 cursor-pointer"
          >
            <div className="w-full h-full rounded-[10px] bg-gray-100 flex items-center justify-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full rounded-[10px] object-cover"
                />
              ) : (
                <span className="text-gray-900 font-bold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
