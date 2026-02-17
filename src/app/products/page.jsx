// src/app/products/page.jsx
import ProductsClient from "@/components/product/ProductsClient";

export const metadata = {
  title: "All Products | Our Store",
  description: "Browse our full collection of curated products.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
