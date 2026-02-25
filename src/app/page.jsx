// app/page.jsx
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import BrandMarquee from "@/components/home/BrandMarquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import TradeAssuranceBanner from "@/components/home/TradeAssuranceBanner";
import FeaturesStrip from "@/components/home/FeaturesStrip";
import FlashDeals from "@/components/home/FlashDeals";
import PromoBanners from "@/components/home/PromoBanners";
import NewArrivals from "@/components/home/NewArrivals";
import Testimonials from "@/components/home/Testimonials";
import ShopByBrand from "@/components/home/ShopByBrand";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <HeroCarousel />
      <FeaturesStrip />
      <CategoryGrid />
      <FlashDeals />
      <FeaturedProducts />
      <PromoBanners />
      <NewArrivals />
      <ShopByBrand />
      <Testimonials />
      <TradeAssuranceBanner />
      <BrandMarquee />
    </main>
  );
}
