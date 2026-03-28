"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ListOrdered,
  ShieldCheck,
  UserCog,
  Settings2,
  Activity,
  Megaphone,
  Truck,
  Heart,
  Package,
  Users,
  BarChart3,
  X,
  Menu,
  LogOut,
  Store,
  ChevronRight,
  Home,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, submitSellerRequest } = useAuth();
  const role = user?.role || "user";
  const [sellerLoading, setSellerLoading] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔗 Role-based links (same as yours)
  const userLinks = [
    { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/user/orders", icon: Package },
    { name: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
    {
      name: "Join Delivery Team",
      href: "/dashboard/user/request-delivery",
      icon: Truck,
    },
    { name: "Profile", href: "/dashboard/user/profile", icon: Users },
  ];

  const sellerLinks = [
    { name: "Dashboard", href: "/dashboard/seller", icon: BarChart3 },
    { name: "Products", href: "/dashboard/seller/products", icon: ShoppingBag },
    { name: "Add Product", href: "/dashboard/seller/add-product", icon: PlusCircle },
    { name: "Orders", href: "/dashboard/seller/orders", icon: ListOrdered },
    { name: "Profile", href: "/dashboard/seller/profile", icon: Users },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Seller Requests", href: "/dashboard/admin/seller-requests", icon: UserCog },
    { name: "Products", href: "/dashboard/admin/products", icon: Package },
    { name: "Sellers Info", href: "/dashboard/admin/sellers", icon: UserCog },
    { name: "Delivery Requests", href: "/dashboard/admin/delivery-requests", icon: Truck },
    { name: "Orders", href: "/dashboard/admin/orders", icon: ListOrdered },
    { name: "System Settings", href: "/dashboard/admin/settings", icon: Settings2 },
    { name: "Health Logs", href: "/dashboard/admin/health", icon: Activity },
    { name: "Promo Code", href: "/dashboard/admin/promo", icon: Megaphone },
    { name: "Profile", href: "/dashboard/admin/profile", icon: Users },
  ];

  const managerLinks = [
    { name: "Overview", href: "/dashboard/manager", icon: LayoutDashboard },
    { name: "Seller Requests", href: "/dashboard/manager/sellers", icon: UserCog },
    { name: "Products", href: "/dashboard/manager/products", icon: Package },
    { name: "Fulfillment", href: "/dashboard/manager/fulfillment", icon: Truck },
    { name: "Marketing", href: "/dashboard/manager/marketing", icon: Megaphone },
    { name: "Platform Stats", href: "/dashboard/manager/stats", icon: BarChart3 },
    { name: "Profile", href: "/dashboard/manager/profile", icon: Users },
  ];

  const deliveryLinks = [
    { name: "Dashboard", href: "/dashboard/delivery", icon: LayoutDashboard },
    { name: "My Deliveries", href: "/dashboard/delivery/orders", icon: Truck },
    { name: "Profile", href: "/dashboard/delivery/profile", icon: Users },
  ];

  const currentLinks =
    role === "admin"
      ? adminLinks
      : role === "seller"
      ? sellerLinks
      : role === "manager"
      ? managerLinks
      : role === "delivery"
      ? deliveryLinks
      : userLinks;

  const sectionLabel =
    role === "admin"
      ? "Admin Control"
      : role === "seller"
      ? "Seller Center"
      : role === "manager"
      ? "Management"
      : role === "delivery"
      ? "Delivery"
      : "Customer";

  // ✅ 🔥 FIXED HEIGHT HERE
  const sidebarContent = (
    <div className="flex flex-col h-screen">

      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
          <ShoppingBag className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">UnityShop</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Dashboard
          </p>
        </div>
      </div>

      <div className="mx-5 h-px bg-gray-200" />

      {/* Middle Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition cursor-pointer"
        >
          <Home size={18} />
          <span className="text-sm font-semibold">Back to Store</span>
        </Link>

        <div>
          <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase mb-3">
            {sectionLabel}
          </h3>

          <div className="space-y-1">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <link.icon size={18} />
                    <span className="text-sm font-semibold">{link.name}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-500 hover:text-white hover:bg-black rounded-xl transition cursor-pointer"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Desktop */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col bg-white border-r">
        {sidebarContent}
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 cursor-pointer"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}