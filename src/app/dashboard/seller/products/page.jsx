"use client";

import ProductsTable from "@/components/dashboard/seller/ProductsTable";

export default function SellerProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Products</h1>
        <p className="text-slate-400">
          Manage your product listings, update details, and track inventory.
        </p>
      </div>

      <ProductsTable />
    </div>
  );
}
