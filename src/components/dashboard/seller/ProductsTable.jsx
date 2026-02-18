"use client";

import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Search, Trash, Edit } from "lucide-react";

export default function ProductsTable() {
    const products = [
        { name: "Premium Wireless Headphones", category: "Electronics", price: "$129.00", stock: 45, sales: 120 },
        { name: "Ergonomic Office Chair", category: "Furniture", price: "$249.00", stock: 12, sales: 45 },
        { name: "Smart Watch Series 7", category: "Wearables", price: "$299.00", stock: 8, sales: 32 },
        { name: "Mechanical Keyboard", category: "Electronics", price: "$150.00", stock: 0, sales: 88 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-white">Top Products</h3>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Product</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-800">
                            <th className="pb-4 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {products.map((product, i) => (
                            <tr key={i} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded bg-slate-700" />
                                        </div>
                                        <span className="font-medium text-white">{product.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-slate-400">{product.category}</td>
                                <td className="py-4 text-sm font-semibold text-white">{product.price}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' :
                                            product.stock > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="py-4 text-sm text-slate-400">{product.sales} sold</td>
                                <td className="py-4 pr-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors">
                                            <Trash size={16} />
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
