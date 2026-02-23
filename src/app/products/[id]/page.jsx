// app/products/[id]/page.jsx

import ProductDetailClient from "@/components/product/ProductDetailClient";

// This is a server component that fetches product data
export default async function ProductPage({ params }) {
  const { id } = await params;

  // Fetch product data from backend API
  let product = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "no-store",
      },
    );
    if (res.ok) {
      product = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch product:", err);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-500">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
