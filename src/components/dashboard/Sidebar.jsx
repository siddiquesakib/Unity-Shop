"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  BarChart3, 
  Users, 
  PlusCircle, 
  ListOrdered 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // Toggle sidebar on mobile
  const toggleSidebar = () => setIsOpen(!isOpen);

  const userLinks = [
    { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/user/orders", icon: Package },
    { name: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
    { name: "Profile", href: "/dashboard/user/profile", icon: Users },
  ];

  const sellerLinks = [
    { name: "Dashboard", href: "/dashboard/seller", icon: BarChart3 },
    { name: "Products", href: "/dashboard/seller/products", icon: ShoppingBag },
    { name: "Add Product", href: "/dashboard/seller/add-product", icon: PlusCircle },
    { name: "Orders", href: "/dashboard/seller/orders", icon: ListOrdered },
  ];

  const SidebarItem = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href}>
        <div
          className={`flex items-center gap-3 px-4 py-3 my-1 rounded-xl transition-all duration-200 group ${
            isActive
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
          }`}
        >
          <item.icon size={20} className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
          <span className="font-medium">{item.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-72 bg-slate-950 border-r border-slate-800/50 flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            UnityShop
          </h1>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          
          {/* User Section */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Customer
            </h3>
            <div className="space-y-1">
              {userLinks.map((link) => (
                <SidebarItem key={link.href} item={link} />
              ))}
            </div>
          </div>

          {/* Seller Section */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Seller Center
            </h3>
            <div className="space-y-1">
              {sellerLinks.map((link) => (
                <SidebarItem key={link.href} item={link} />
              ))}
            </div>
          </div>

        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/50">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}
    </>
  );
}
