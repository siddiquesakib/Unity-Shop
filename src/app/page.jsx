// app/page.jsx
import Image from "next/image";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import TradeAssuranceBanner from "@/components/home/TradeAssuranceBanner";
import FlashDeals from "@/components/home/FlashDeals";
import PromoBanners from "@/components/home/PromoBanners";
import Testimonials from "@/components/home/Testimonials";
import ShopByBrand from "@/components/home/ShopByBrand";
import BecomeSellerCTA from "@/components/home/BecomeSellerCTA";

export default function Home() {
  return (
    <main className="min-h-screen font-sans relative">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200 via-purple-200 to-indigo-200 opacity-70"></div>
      <HeroCarousel />
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
