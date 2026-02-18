"use client";

import SellerStats from "@/components/dashboard/seller/SellerStats";
import SalesChart from "@/components/dashboard/seller/SalesChart";
import ProductsTable from "@/components/dashboard/seller/ProductsTable";
import SellerOrders from "@/components/dashboard/seller/SellerOrders";

export default function SellerDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
                    <p className="text-slate-400">Manage your products, orders, and view sales performance.</p>
                </div>
            </div>

            {/* Stats Section */}
            <SellerStats />

            {/* Charts & Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <SellerOrders />
            </div>

            {/* Products Table */}
            <ProductsTable />
        </div>
    );
}
