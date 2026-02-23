// app/products/[id]/page.jsx

import ProductDetailClient from "@/components/product/ProductDetailClient";

// This is a server component that fetches product data
export default async function ProductPage({ params }) {
  const { id } = params;

  // In a real app, fetch product data from API/database
  const product = await getProduct(id);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}

// Mock data function (replace with actual data fetching)
async function getProduct(id) {
  // Simulate API call
  return {
    id,
    name: "Professional Wireless Noise Cancelling Headphones with 40mm Drivers",
    sku: "HP-WH-1000XM4",
    brand: "SoundMaster",
    priceTiers: [
      { quantity: 100, price: 18.5 },
      { quantity: 500, price: 16.2 },
      { quantity: 1000, price: 14.8 },
      { quantity: 5000, price: 12.5 },
    ],
    moq: 100,
    unit: "pieces",
    stock: 25000,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format",
    ],
    variants: [
      { name: "Color", options: ["Black", "Silver", "Blue"] },
      { name: "Connectivity", options: ["Bluetooth 5.0", "Wired"] },
    ],
    description: `
      <h3>Product Overview</h3>
      <p>Experience premium sound quality with our professional wireless headphones. Designed for comfort and durability, these headphones feature active noise cancellation, 40mm neodymium drivers, and up to 30 hours of battery life.</p>
      <h4>Key Features:</h4>
      <ul>
        <li>Active Noise Cancellation (ANC) technology</li>
        <li>Bluetooth 5.0 with aptX support</li>
        <li>40mm dynamic drivers for rich sound</li>
        <li>30-hour battery life with fast charging</li>
        <li>Foldable design for easy storage</li>
        <li>Includes carrying case and audio cable</li>
      </ul>
    `,
    specifications: [
      { label: "Driver Size", value: "40mm" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32Ω" },
      { label: "Battery Life", value: "30 hours" },
      { label: "Charging Time", value: "2 hours" },
      { label: "Weight", value: "250g" },
      { label: "Warranty", value: "12 months" },
      { label: "Certifications", value: "CE, FCC, RoHS" },
    ],
    supplier: {
      id: "supplier-123",
      name: "Shenzhen Electronics Co., Ltd.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format",
      rating: 4.8,
      reviewCount: 1234,
      location: "Shenzhen, China",
      yearsInBusiness: 8,
      responseRate: 98,
      responseTime: "< 2 hours",
      tradeAssurance: true,
      verified: true,
      productsCount: 345,
      followers: 12890,
    },
    reviews: [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        date: "2024-01-15",
        title: "Excellent quality",
        content:
          "The sound quality is amazing and the build is solid. Our customers love them.",
        verifiedPurchase: true,
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        date: "2024-01-10",
        title: "Good value",
        content:
          "Good product for the price. Communication with supplier was smooth.",
        verifiedPurchase: true,
      },
    ],
  };
}
