"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";

export default function WishlistPreview() {
    const products = [
        { name: "Wireless Headphones", price: "$129.00", category: "Electronics" },
        { name: "Smart Watch Series 7", price: "$299.00", category: "Wearables" },
        { name: "Ergonomic Office Chair", price: "$249.00", category: "Furniture" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Wishlist</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {products.map((product, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 group hover:border-slate-700 transition-all">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600">
                            {/* Placeholder for image */}
                            <div className="w-6 h-6 rounded bg-slate-700" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                            <p className="text-xs text-slate-500">{product.category}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-bold text-indigo-400">{product.price}</p>
                        </div>

                        <button className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                            <ShoppingCart size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
