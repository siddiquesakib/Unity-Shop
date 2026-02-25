// src/app/products/page.jsx
import { Suspense } from "react";
import ProductsClient from "@/components/product/ProductsClient";

export const metadata = {
  title: "All Products | Our Store",
  description: "Browse our full collection of curated products.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full" />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
