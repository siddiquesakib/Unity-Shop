"use client";

import SellerStats from "@/components/dashboard/seller/SellerStats";
import SalesChart from "@/components/dashboard/seller/SalesChart";
import ProductsTable from "@/components/dashboard/seller/ProductsTable";
import SellerOrders from "@/components/dashboard/seller/SellerOrders";
import { ShoppingBag } from "lucide-react";

export default function SellerDashboard() {
  return (
    <div className="space-y-12 pb-16 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-black shadow-lg shadow-black/10">
              <ShoppingBag className="text-white" size={16} />
            </div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Partner Terminal
            </span>
          </div>
          <h1 className="text-5xl font-black text-black uppercase tracking-tight leading-[0.9]">
            Seller <span className="text-gray-200">Suite</span>
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-md">
            Manage your inventory, monitor sales velocity, and scale your
            digital presence.
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] self-start transition-all hover:border-black/20 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-xs font-black text-black uppercase tracking-widest">
            Trading Desk Active
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <SellerStats />

      {/* Charts & Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <SalesChart />
        <div className="min-h-[450px]">
          <SellerOrders />
        </div>
      </div>

      {/* Products Table */}
      <div className="p-2 rounded-[2.5rem] bg-gray-50/50 border border-gray-100">
        <ProductsTable />
      </div>
    </div>
  );
}
