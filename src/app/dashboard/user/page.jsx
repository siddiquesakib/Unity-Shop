"use client";

import UserStats from "@/components/dashboard/user/UserStats";
import RecentOrders from "@/components/dashboard/user/RecentOrders";
import UserProfile from "@/components/dashboard/user/UserProfile";
import WishlistPreview from "@/components/dashboard/user/WishlistPreview";

export default function UserDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Good Morning, Alex! 👋</h1>
                    <p className="text-slate-400">Here's what's happening with your store today.</p>
                </div>
                <div className="text-sm text-slate-500">
                    Last login: Today, 09:42 AM
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
