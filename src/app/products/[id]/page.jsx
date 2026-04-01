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
    notFound = true;
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfbf7] px-4 py-20 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-gray-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

        <div className="max-w-3xl w-full text-center space-y-10 z-10 relative">
          <div className="relative w-32 h-32 mx-auto group">
            <div className="absolute inset-0 bg-gray-300 rounded-[2rem] rotate-12 scale-110 opacity-20 mt-2 transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-100"></div>
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 z-10">
              <svg className="w-14 h-14 text-gray-800" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)] border-[3px] border-white flex items-center justify-center animate-bounce z-20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight drop-shadow-sm">
              Product Gone!
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
              This item is out of stock, unavailable, or the link is broken.
              <br className="hidden md:block mt-3" />
              <span className="mt-4 font-bold text-gray-800 bg-white px-4 py-1.5 rounded-xl border border-gray-200 inline-block shadow-sm">Let&apos;s find you something better.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a
              href="/products"
              className="group flex flex-1 sm:flex-auto items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-800 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 active:scale-95"
            >
              <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Explore Collection
            </a>
            <a
              href="/"
              className="group flex flex-1 sm:flex-auto items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-white text-black border-2 border-gray-200 rounded-2xl font-black text-lg shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 hover:border-black transition-all duration-300 active:scale-95"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
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
