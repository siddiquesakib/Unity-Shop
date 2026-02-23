// app/page.jsx
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import TradeAssuranceBanner from "@/components/home/TradeAssuranceBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <HeroCarousel />
      <CategoryGrid />
      <FeaturedProducts />
      <TradeAssuranceBanner />
    </main>
  );
}
