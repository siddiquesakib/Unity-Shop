"use client";

import UserStats from "@/components/dashboard/user/UserStats";
import RecentOrders from "@/components/dashboard/user/RecentOrders";
import UserProfile from "@/components/dashboard/user/UserProfile";
import WishlistPreview from "@/components/dashboard/user/WishlistPreview";
import { useAuth } from "@/hooks/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}, {user?.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-slate-400">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Section */}
      <UserStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Orders (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentOrders />
        </div>

        {/* Right Column - Profile & Wishlist (Takes 1 column) */}
        <div className="space-y-6">
          <UserProfile />
          <WishlistPreview />
        </div>
      </div>
    </div>
  );
}
