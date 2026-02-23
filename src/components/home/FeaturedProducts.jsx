// components/home/ProductGrid.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";

// Demo product data
const demoProducts = [
  {
    id: 1,
    category: "living",
    name: "Bouclé Accent Chair",
    price: 320,
    originalPrice: 420,
    badge: "Sale",
    description: "Cloud-soft textured fabric",
    image:
      "https://www.lunafurn.com/cdn/shop/products/Bonita-Ivory-Boucle-Accent-Chair-Luna-Furniture-24362493116470.jpg?v=1766894286&width=1214",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    category: "kitchen",
    name: "Matte Ceramic Mug",
    price: 48,
    originalPrice: null,
    badge: "New",
    description: "Set of 4, hand-thrown clay",
    image:
      "https://m.media-amazon.com/images/I/61vDW+CrR4L._AC_UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 3,
    category: "lighting",
    name: "Wasabi Table Lamp",
    price: 175,
    originalPrice: null,
    badge: "Best Seller",
    description: "Organic linen shade, brass base",
    image:
      "https://i.etsystatic.com/50833053/r/il/70f652/6203456555/il_1080xN.6203456555_79uz.jpg",
    rating: 4.7,
    reviews: 210,
  },
  {
    id: 4,
    category: "stationery",
    name: "Leather Desk Journal",
    price: 64,
    originalPrice: null,
    badge: null,
    description: "Full-grain leather, 200 pages",
    image:
      "https://m.media-amazon.com/images/I/81nm0wY-T5L._AC_UF894,1000_QL80_.jpg",
    rating: 4.6,
    reviews: 56,
  },
  {
    id: 5,
    category: "bedroom",
    name: "Merino Blanket",
    price: 98,
    originalPrice: null,
    badge: "Trending",
    description: "Ethically sourced merino wool",
    image:
      "https://m.media-amazon.com/images/I/61mL5eF+sUL._AC_UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 175,
  },
  {
    id: 6,
    category: "living",
    name: "Ceramic Vase",
    price: 89,
    originalPrice: 129,
    badge: "Sale",
    description: "Hand-thrown, reactive glaze",
    image: "https://m.media-amazon.com/images/I/81XKT5k3Y-L.jpg",
    rating: 4.5,
    reviews: 43,
  },
  {
    id: 7,
    category: "kitchen",
    name: "Wood Cutting Board",
    price: 72,
    originalPrice: null,
    badge: null,
    description: "Single-piece solid olive wood",
    image:
      "https://m.media-amazon.com/images/I/81Dvha78PXL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 97,
  },
  {
    id: 8,
    category: "lighting",
    name: "Arc Floor Lamp",
    price: 298,
    originalPrice: 380,
    badge: "Sale",
    description: "Matte black, adjustable arm",
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/c179a522-e3f9-4c09-b693-8ead32a8bec5.__CR0,0,970,600_PT0_SX970_V1___.png",
    rating: 4.6,
    reviews: 62,
  },
  {
    id: 9,
    category: "bedroom",
    name: "Linen Pillow Cover",
    price: 55,
    originalPrice: null,
    badge: "New",
    description: "Belgian linen, set of 2",
    image:
      "https://m.media-amazon.com/images/I/61IKiWblD6L._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 134,
  },
  {
    id: 10,
    category: "outdoor",
    name: "Garden Lantern",
    price: 42,
    originalPrice: null,
    badge: null,
    description: "Handwoven, weather-resistant",
    image:
      "https://m.media-amazon.com/images/I/816gjPfgJnL._AC_UF894,1000_QL80_.jpg",
    rating: 4.4,
    reviews: 29,
  },
  {
    id: 11,
    category: "stationery",
    name: "Brass Pen + Stand",
    price: 38,
    originalPrice: null,
    badge: "New",
    description: "Solid brass, refillable ink",
    image:
      "https://m.media-amazon.com/images/I/618wX9Rtd7L._AC_UF894,1000_QL80_.jpg",
    rating: 4.5,
    reviews: 41,
  },
  {
    id: 12,
    category: "living",
    name: "Wool Rug",
    price: 485,
    originalPrice: 620,
    badge: "Sale",
    description: "2.5m × 3m, natural dyes",
    image:
      "https://m.media-amazon.com/images/I/91aDxPFbj5L._AC_UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 13,
    category: "kitchen",
    name: "Cast Iron Skillet",
    price: 115,
    originalPrice: null,
    badge: "Best Seller",
    description: "Pre-seasoned, 26cm diameter",
    image:
      "https://www.southernliving.com/thmb/6au1bFnqJOguxeJ7IkdRJJSI8WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/slv-primary-cast-iron-skillets-sep-24-dburreson-001-1-1-eefaede19519484693c0f7c9cdbb3a0b.jpeg",
    rating: 4.8,
    reviews: 302,
  },
  {
    id: 14,
    category: "bedroom",
    name: "Soy Pillar Candle",
    price: 44,
    originalPrice: null,
    badge: null,
    description: "Vetiver & cedar, 40hr burn",
    image:
      "https://m.media-amazon.com/images/I/717I73p5evL._AC_UF894,1000_QL80_.jpg",
    rating: 4.6,
    reviews: 77,
  },
  {
    id: 15,
    category: "lighting",
    name: "Woven Pendant Light",
    price: 210,
    originalPrice: null,
    badge: "Trending",
    description: "Hand-woven rattan shade",
    image:
      "https://m.media-amazon.com/images/I/51dTgdO9c7L._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 53,
  },
  {
    id: 16,
    category: "stationery",
    name: "Linen Notebook Set",
    price: 29,
    originalPrice: null,
    badge: null,
    description: "A5 size, set of 3, ruled",
    image:
      "https://m.media-amazon.com/images/I/71Etky4MukL._AC_UF894,1000_QL80_.jpg",
    rating: 4.4,
    reviews: 35,
  },
  {
    id: 17,
    category: "outdoor",
    name: "Copper Planter",
    price: 88,
    originalPrice: null,
    badge: "New",
    description: "Aged copper finish, drainage hole",
    image: "https://m.media-amazon.com/images/I/81JlCy5DKuL.jpg",
    rating: 4.5,
    reviews: 21,
  },
  {
    id: 18,
    category: "living",
    name: "Travertine Side Table",
    price: 375,
    originalPrice: null,
    badge: null,
    description: "Natural stone top, powder-coated",
    image: "https://urban-road.neto.com.au/assets/images/Oro-Archer%20copy.jpg",
    rating: 4.8,
    reviews: 66,
  },
  {
    id: 19,
    category: "kitchen",
    name: "Stoneware Bowl",
    price: 58,
    originalPrice: 80,
    badge: "Sale",
    description: "Reactive glaze, oven-safe",
    image:
      "https://m.media-amazon.com/images/I/51TMxzmGD6L._AC_UF894,1000_QL80_.jpg",
    rating: 4.6,
    reviews: 49,
  },
  {
    id: 20,
    category: "bedroom",
    name: "Walnut Bedside Tray",
    price: 66,
    originalPrice: null,
    badge: null,
    description: "Solid walnut with lip edge",
    image:
      "https://m.media-amazon.com/images/I/714sIKrRmKL._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 38,
  },
  {
    id: 21,
    category: "living",
    name: "Linen Basket",
    price: 49,
    originalPrice: null,
    badge: "New",
    description: "Chunky weave, collapsible",
    image:
      "https://m.media-amazon.com/images/I/51xhPxlDa5L._AC_UF894,1000_QL80_.jpg",
    rating: 4.5,
    reviews: 55,
  },
  {
    id: 22,
    category: "lighting",
    name: "Concrete Desk Lamp",
    price: 145,
    originalPrice: null,
    badge: null,
    description: "Poured concrete base, linen shade",
    image: "https://cdn01.pinkoi.com/product/skkib4QV/0/9/640x530.jpg",
    rating: 4.6,
    reviews: 44,
  },
  {
    id: 23,
    category: "kitchen",
    name: "Linen Apron",
    price: 52,
    originalPrice: null,
    badge: null,
    description: "Washed Belgian linen, adjustable",
    image: "https://m.media-amazon.com/images/I/71c8e5o7vRL.jpg",
    rating: 4.7,
    reviews: 81,
  },
  {
    id: 24,
    category: "living",
    name: "Marble Bookend Pair",
    price: 95,
    originalPrice: null,
    badge: "Trending",
    description: "Solid white Carrara marble",
    image:
      "https://m.media-amazon.com/images/I/61QAf3NfTVL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 72,
  },
  {
    id: 25,
    category: "stationery",
    name: "Fountain Pen Set",
    price: 55,
    originalPrice: null,
    badge: "Trending",
    description: "Vintage style, with ink bottles",
    image:
      "https://newellbrands.imgix.net/b77a014a-442c-30e7-a6f9-de2925b1aa90/b77a014a-442c-30e7-a6f9-de2925b1aa90.jpg?fm=jpg",
    rating: 4.7,
    reviews: 65,
  },
  {
    id: 26,
    category: "bedroom",
    name: "Silk Pillowcase",
    price: 45,
    originalPrice: null,
    badge: "New",
    description: "100% mulberry silk, 300 thread count",
    image:
      "https://m.media-amazon.com/images/I/41KHic6Ra-L._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 27,
    category: "kitchen",
    name: "Bamboo Steamer",
    price: 35,
    originalPrice: null,
    badge: "Trending",
    description: "Two-tier, natural bamboo",
    image:
      "https://m.media-amazon.com/images/I/610g-C4Uu8L._AC_UF894,1000_QL80_.jpg",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 28,
    category: "living",
    name: "LED Strip Lights",
    price: 28,
    originalPrice: null,
    badge: "Best Seller",
    description: "5m, RGB color changing LED strip",
    image:
      "https://m.media-amazon.com/images/I/61sd9XlMzpL._AC_UF894,1000_QL80_.jpg",
    rating: 4.5,
    reviews: 200,
  },
  {
    id: 29,
    category: "living",
    name: "Wall Art Print",
    price: 120,
    originalPrice: null,
    badge: "Sale",
    description: "Framed abstract art",
    image:
      "https://m.media-amazon.com/images/I/71c+zy+x-3L._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 30,
    category: "outdoor",
    name: "Hammock Chair",
    price: 99,
    originalPrice: null,
    badge: "Trending",
    description: "Cotton rope, with stand",
    image:
      "https://m.media-amazon.com/images/I/81d6sEGXtEL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviews: 110,
  },
  {
    id: 31,
    category: "stationery",
    name: "Planner 2024",
    price: 25,
    originalPrice: null,
    badge: "Trending",
    description: "Daily planner with stickers",
    image:
      "https://i.fbcd.co/products/resized/resized-750-500/preview-01-2af35ed048a87bab0395b56e9457941df72e58ea65fff77a33ed1c8692dee1c2.jpg",
    rating: 4.6,
    reviews: 78,
  },
  {
    id: 32,
    category: "bedroom",
    name: "Memory Foam Pillow",
    price: 60,
    originalPrice: null,
    badge: "Trending",
    description: "Ergonomic design",
    image:
      "https://m.media-amazon.com/images/I/51E3IUhCAOL._AC_UF894,1000_QL80_.jpg",
    rating: 4.9,
    reviews: 150,
  },
  {
    id: 33,
    category: "kitchen",
    name: "Spice Rack",
    price: 40,
    originalPrice: null,
    badge: "Trending",
    description: "Wooden, 16 jars",
    image:
      "https://m.media-amazon.com/images/I/61kIUbjJ5gL._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 34,
    category: "lighting",
    name: "Solar Garden Lights",
    price: 55,
    originalPrice: null,
    badge: "New",
    description: "Set of 6, waterproof",
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/59f98b23-c97e-4443-93b9-cd9ad61c362f.__CR0,0,970,600_PT0_SX970_V1___.jpg",
    rating: 4.5,
    reviews: 67,
  },
];

const FeaturedProducts = ({
  title = "Recommended Products",
  viewAllLink = "/products",
  initialProducts = demoProducts, // Show all products by default
  loadMoreCount = demoProducts.length, // No need for load more
}) => {
  const [filter, setFilter] = useState("recommended");
  const [visibleProducts, setVisibleProducts] = useState(initialProducts);
  const [allProducts] = useState(demoProducts); // In real app, fetch from API
  const [loading, setLoading] = useState(false);

  const filters = [
    { id: "recommended", label: "Recommended" },
    { id: "latest", label: "Latest" },
    { id: "topSuppliers", label: "Top Suppliers" },
  ];

  const handleFilterChange = (filterId) => {
    setFilter(filterId);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = [...demoProducts];
      if (filterId === "latest") {
        filtered = filtered.sort((a, b) =>
          a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1,
        );
      } else if (filterId === "topSuppliers") {
        filtered = filtered.sort(
          (a, b) => b.supplier.rating - a.supplier.rating,
        );
      }
      setVisibleProducts(filtered.slice(0, visibleProducts.length));
      setLoading(false);
    }, 500);
  };

  const handleLoadMore = () => {
    const currentCount = visibleProducts.length;
    const moreProducts = allProducts.slice(
      currentCount,
      currentCount + loadMoreCount,
    );
    setVisibleProducts([...visibleProducts, ...moreProducts]);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-600 mt-2">
              Discover top-quality products from verified suppliers
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="mt-4 md:mt-0 inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group"
          >
            View All Products
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 glass p-6 rounded-2xl border border-gray-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {/* Hide Load More button since all products are shown */}
      </div>
    </section>
  );
};

export default FeaturedProducts;
