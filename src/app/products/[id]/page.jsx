// src/app/products/[id]/page.jsx
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateMetadata({ params }) {
  // TODO: fetch real product from /api/products/[id] and return title/description
  return {
    title: "Bouclé Accent Chair · Unity Shop",
    description: "Hand-finished bouclé accent chair with solid walnut legs.",
  };
}

export default function ProductDetailPage({ params }) {
  // params.id is available here — pass to client for the API call
  return <ProductDetailClient productId={params.id} />;
}
