"use client";

import UserStats from "@/components/dashboard/user/UserStats";
import RecentOrders from "@/components/dashboard/user/RecentOrders";
import UserProfile from "@/components/dashboard/user/UserProfile";
import WishlistPreview from "@/components/dashboard/user/WishlistPreview";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-12 pb-16 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-black shadow-lg shadow-black/10">
              <ShoppingBag className="text-white" size={16} />
            </div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Personal Terminal
            </span>
          </div>
          <h1 className="text-5xl font-black text-black uppercase tracking-tight leading-[0.9]">
            {getGreeting().split(" ")[0]} <span className="text-gray-200">{user?.name?.split(" ")[0] || "Client"}</span>
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-md">
            Welcome back to your curated shopping experience and mission-control center.
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] self-start transition-all hover:border-black/20 group cursor-default">
          <div className="text-xs font-black text-black uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <UserStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Orders (Takes 2 columns) */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Right Column - Profile & Wishlist (Takes 1 column) */}
        <div className="space-y-10">
          <div className="p-1.5 rounded-[2.5rem] bg-gray-50/50 border border-gray-100">
            <UserProfile />
          </div>
          <div className="p-1.5 rounded-[2.5rem] bg-gray-50/50 border border-gray-100">
            <WishlistPreview />
          </div>
        </div>
      </div>
    </div>

  );
}
