"use client";

import ProductsTable from "@/components/dashboard/seller/ProductsTable";

export default function SellerProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <p className="text-gray-500">
          Manage your product listings, update details, and track inventory.
        </p>
      </div>

      <ProductsTable />
    </div>
  );
}
