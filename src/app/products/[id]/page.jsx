// app/products/[id]/page.jsx

import ProductDetailClient from "@/components/product/ProductDetailClient";

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const REQUEST_TIMEOUT_MS = 12000;

async function fetchWithRetry(url, options = {}, retries = 1) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError;
}

// This is a server component that fetches product data
export default async function ProductPage({ params }) {
  const { id } = await params;

  // Fetch product data from backend API
  let product = null;
  let notFound = false;
  let hasTemporaryError = false;
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/products/${id}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      product = await res.json();
    } else if (res.status === 404) {
      notFound = true;
    } else {
      hasTemporaryError = true;
    }
  } catch (err) {
    console.error("Failed to fetch product:", err);
    hasTemporaryError = true;
  }

  if (hasTemporaryError) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Temporary Server Delay
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            The product server is taking a bit longer to respond. Please try
            again in a few seconds.
          </p>
          <a
            href={`/products/${id}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Retry
          </a>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
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
    const relRes = await fetchWithRetry(
      `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`,
      { next: { revalidate: 30 } },
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
