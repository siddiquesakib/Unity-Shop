"use client";

import ProductManagement from "@/components/dashboard/admin/ProductManagement";
import { ShieldCheck } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="text-gray-900" size={20} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <p className="text-gray-500">
          View, search, and delete any product on the platform.
        </p>
      </div>

      <ProductManagement />
    </div>
  );
}
