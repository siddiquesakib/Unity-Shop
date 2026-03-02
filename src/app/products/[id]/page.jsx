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
      <div className="min-h-screen bg-[#f7f6f3] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Product Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  // Fetch related products for "Frequently Bought Together"
  let relatedProducts = [];
  try {
    const category = product.category || "";
    const relRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(category)}`,
      { cache: "no-store" },
    );
    if (relRes.ok) {
      const data = await relRes.json();
      const items = Array.isArray(data) ? data : data.products || [];
      relatedProducts = items.filter((p) => (p._id || p.id) !== id).slice(0, 3);
    }
  } catch {
    /* silently ignore */
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </div>
    </div>
  );
}
