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
  const { user, logout } = useAuth();
  const role = user?.role || "user";
  const [requestSent, setRequestSent] = useState(false);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userLinks = [
    { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/user/orders", icon: Package },
    { name: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
    { name: "Profile", href: "/dashboard/user/profile", icon: Users },
  ];

  const sellerLinks = [
    { name: "Dashboard", href: "/dashboard/seller", icon: BarChart3 },
    { name: "Products", href: "/dashboard/seller/products", icon: ShoppingBag },
    {
      name: "Add Product",
      href: "/dashboard/seller/add-product",
      icon: PlusCircle,
    },
    { name: "Orders", href: "/dashboard/seller/orders", icon: ListOrdered },
    { name: "Profile", href: "/dashboard/seller/profile", icon: Users },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Seller Requests", href: "/dashboard/admin/seller-requests", icon: UserCog },
    { name: "Products", href: "/dashboard/admin/products", icon: Package },

    {
      name: "System Settings",
      href: "/dashboard/admin/settings",
      icon: Settings2,
    },
    { name: "Health Logs", href: "/dashboard/admin/health", icon: Activity },
    { name: "Promo Code", href: "/dashboard/admin/promo", icon: Megaphone },
    { name: "Profile", href: "/dashboard/admin/profile", icon: Users },
  ];

  const managerLinks = [
    { name: "Overview", href: "/dashboard/manager", icon: LayoutDashboard },
    {
      name: "Seller Requests",
      href: "/dashboard/manager/sellers",
      icon: UserCog,
    },
    { name: "Products", href: "/dashboard/manager/products", icon: Package },
    {
      name: "Fulfillment",
      href: "/dashboard/manager/fulfillment",
      icon: Truck,
    },
    {
      name: "Marketing",
      href: "/dashboard/manager/marketing",
      icon: Megaphone,
    },
    {
      name: "Platform Stats",
      href: "/dashboard/manager/stats",
      icon: BarChart3,
    },
    { name: "Profile", href: "/dashboard/manager/profile", icon: Users },
  ];

  const currentLinks =
    role === "admin"
      ? adminLinks
      : role === "seller"
        ? sellerLinks
        : role === "manager"
          ? managerLinks
          : userLinks;

  const sectionLabel =
    role === "admin"
      ? "Admin Control"
      : role === "seller"
        ? "Seller Center"
        : role === "manager"
          ? "Management"
          : "Customer";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
          <ShoppingBag className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            UnityShop
          </h1>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            Dashboard
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gray-200" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-hide">
        {/* Back to Store */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all text-sm"
        >
          <Home size={18} />
          <span className="font-medium">Back to Store</span>
        </Link>

        <div className="h-px bg-gray-100" />

        {/* Section */}
        <div>
          <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
            {sectionLabel}
          </h3>
          <div className="space-y-0.5">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-black rounded-r-full" />
                    )}
                    <link.icon
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                    />
                    <span className="text-sm font-medium">{link.name}</span>
                    {isActive && (
                      <ChevronRight
                        size={14}
                        className="ml-auto text-white/60"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Become Seller CTA — only for users */}
        {role === "user" && (
          <div className="pt-2">
            <div className="h-px bg-gray-100 mb-4" />
            {user?.sellerRequest === "pending" || requestSent ? (
              <div className="flex items-center gap-3 px-3 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm">
                <Store size={18} />
                <div>
                  <p className="font-medium text-xs">Seller Request</p>
                  <p className="text-[10px] text-amber-500">
                    Pending review...
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href="/dashboard/user/become-seller"
                className="w-full flex items-center gap-3 px-3 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 rounded-xl transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-lg bg-gray-200 group-hover:bg-gray-300 transition-colors">
                  <Store size={16} />
                </div>
                <span className="text-sm font-medium">
                  {user?.sellerRequest === "rejected"
                    ? "Re-apply as Seller"
                    : "Become a Seller"}
                </span>
              </Link>
            )}
          </div>
        )}

      </div>

      {/* User Info Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-400 capitalize font-medium">
              {role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm"
        >
          <LogOut size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-70 w-72 bg-white shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
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


