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
  const { user, logout, requestSeller } = useAuth();
  const role = user?.role || "user";
  const [sellerLoading, setSellerLoading] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
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
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Sellers Info", href: "/dashboard/admin/sellers", icon: UserCog },
    {
      name: "System Settings",
      href: "/dashboard/admin/settings",
      icon: Settings2,
    },
    { name: "Health Logs", href: "/dashboard/admin/health", icon: Activity },
  ];

  const managerLinks = [
    { name: "Overview", href: "/dashboard/manager", icon: LayoutDashboard },
    {
      name: "Seller Requests",
      href: "/dashboard/manager/sellers",
      icon: UserCog,
    },
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
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <ShoppingBag className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            UnityShop
          </h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            Dashboard
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-hide">
        {/* Back to Store */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
        >
          <Home size={18} />
          <span className="font-medium">Back to Store</span>
        </Link>

        <div className="h-px bg-slate-800/50" />

        {/* Section */}
        <div>
          <h3 className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-3">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-400 rounded-r-full" />
                    )}
                    <link.icon
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-300"
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
            <div className="h-px bg-slate-800/50 mb-4" />
            {user?.sellerRequest === "pending" || requestSent ? (
              <div className="flex items-center gap-3 px-3 py-3 bg-amber-500/5 border border-amber-500/15 text-amber-400 rounded-xl text-sm">
                <Store size={18} />
                <div>
                  <p className="font-medium text-xs">Seller Request</p>
                  <p className="text-[10px] text-amber-400/70">
                    Pending review...
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSellerModal(true)}
                className="w-full flex items-center gap-3 px-3 py-3 bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                  <Store size={16} />
                </div>
                <span className="text-sm font-medium">
                  {user?.sellerRequest === "rejected"
                    ? "Re-apply as Seller"
                    : "Become a Seller"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Info Footer */}
      <div className="px-4 py-4 border-t border-slate-800/30">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-500 capitalize font-medium">
              {role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 text-sm"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/90 backdrop-blur-sm text-white rounded-xl shadow-xl border border-slate-700/50 hover:bg-slate-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/40">
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
              className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
            />
            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-70 w-72 bg-slate-950 shadow-2xl shadow-black/40"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Seller Request Modal */}
      <AnimatePresence>
        {showSellerModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !sellerLoading && setShowSellerModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Store size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Request Seller Account
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Your request will be reviewed by the admin team. Once
                  approved, your account will be upgraded to{" "}
                  <strong className="text-white">Seller</strong> and you&apos;ll
                  be able to manage products and orders.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSellerModal(false)}
                    disabled={sellerLoading}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setSellerLoading(true);
                      const res = await requestSeller();
                      setSellerLoading(false);
                      if (res.success) {
                        setRequestSent(true);
                        setShowSellerModal(false);
                      } else {
                        alert(res.error || "Failed to submit request");
                      }
                    }}
                    disabled={sellerLoading}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                  >
                    {sellerLoading ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
