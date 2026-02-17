// app/page.jsx
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-150 w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to Our Store
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
            Discover the best products at unbeatable prices. Shop now and enjoy
            fast shipping!
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Optional: Call to Action Section */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                On all orders over $50
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">
                100% secure transactions
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dedicated customer service
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
