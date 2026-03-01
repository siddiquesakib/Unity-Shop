// app/page.jsx
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import TradeAssuranceBanner from "@/components/home/TradeAssuranceBanner";
import FeaturesStrip from "@/components/home/FeaturesStrip";
import FlashDeals from "@/components/home/FlashDeals";
import PromoBanners from "@/components/home/PromoBanners";
import Testimonials from "@/components/home/Testimonials";
import ShopByBrand from "@/components/home/ShopByBrand";
import BecomeSellerCTA from "@/components/home/BecomeSellerCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f3] font-sans">
      <HeroCarousel />
      <FeaturesStrip />
      <CategoryGrid />
      <FlashDeals />
      <FeaturedProducts />
      <PromoBanners />
      <ShopByBrand />
      <Testimonials />
      <BecomeSellerCTA />
      <TradeAssuranceBanner />
    </main>
  );
}
