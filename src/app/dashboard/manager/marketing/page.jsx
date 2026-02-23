"use client";

import { Megaphone, Tag, Gift, Percent, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="text-indigo-400" size={20} />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Marketing
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
          Promotions & Marketing
        </h1>
        <p className="text-slate-400">
          Manage coupons, campaigns, and platform promotions.
        </p>
      </div>

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Coupon Management",
            description:
              "Create and manage discount coupons for products and categories.",
            icon: Tag,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
          },
          {
            title: "Flash Sales",
            description: "Set up time-limited flash sales and special offers.",
            icon: Percent,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            title: "Featured Products",
            description:
              "Spotlight products on the homepage for increased visibility.",
            icon: Gift,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden"
          >
            <div className={`p-3 rounded-xl ${item.bg} w-fit mb-4`}>
              <item.icon className={item.color} size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{item.description}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">
              <TrendingUp size={12} />
              Coming Soon
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 text-center">
        <Megaphone size={48} className="text-indigo-400/40 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Marketing Tools Coming Soon
        </h3>
        <p className="text-slate-400 max-w-md mx-auto">
          We&apos;re building powerful marketing tools to help you grow the
          platform. Stay tuned for coupon management, flash sales, email
          campaigns, and more!
        </p>
      </div>
    </div>
  );
}
