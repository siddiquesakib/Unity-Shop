"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiPackage,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiPhone,
  FiArrowRight,
  FiMapPin,
  FiTruck,
} from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Products", href: "/products", icon: FiShoppingBag },
  { name: "About", href: "/about", icon: FiInfo },
  { name: "Contact", href: "/contact", icon: FiPhone },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchExpanded(false);
      setIsOpen(false);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Promo Top Bar */}
      <div
        className={`hidden md:block bg-gray-900 text-gray-300 text-xs transition-all duration-300 overflow-hidden ${
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <FiTruck size={13} className="text-emerald-400" />
              Free shipping on orders $50+
            </span>
            <span className="flex items-center gap-1.5">
              <FiMapPin size={13} className="text-orange-400" />
              Delivering worldwide
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!user && (
              <Link
                href="/register"
                className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 transition-colors"
              >
                Join now & get 10% off <FiArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-gray-200/50"
            : "bg-white/50 backdrop-blur-xl border-b border-gray-100/60"
        }`}
        style={{ WebkitBackdropFilter: scrolled ? "blur(40px)" : "blur(20px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Row */}
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="shrink-0 group relative">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={145}
                height={42}
                className="object-contain transition-all duration-300 group-hover:brightness-110"
                priority
              />
            </Link>

            {/* Center: Search - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <FiSearch
                    size={17}
                    className="absolute left-4 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full pl-11 pr-24 py-3 rounded-2xl text-sm bg-gray-100/80 border border-gray-200/60 focus:bg-white focus:border-orange-300/60 focus:ring-2 focus:ring-orange-500/15 outline-none transition-all duration-300 placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-linear-to-r from-orange-500 to-rose-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Wishlist */}
              <Link
                href="/dashboard/wishlist"
                className="relative p-2.5 text-gray-500 hover:text-rose-500 rounded-xl hover:bg-rose-50/80 transition-all duration-200"
                title="Wishlist"
              >
                <FiHeart size={21} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-gray-500 hover:text-orange-500 rounded-xl hover:bg-orange-50/80 transition-all duration-200"
                title="Cart"
              >
                <FiShoppingCart size={21} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-linear-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 animate-in zoom-in duration-200">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              <div className="w-px h-7 bg-gray-200/80 mx-2" />

              {/* User */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl transition-all duration-200 ${
                      showUserMenu ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-400 via-rose-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-orange-500/20 ring-2 ring-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-[13px] font-semibold text-gray-800 leading-tight max-w-24 truncate">
                        {user.name?.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize leading-tight">
                        {user.role || "Customer"}
                      </p>
                    </div>
                    <FiChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-gray-100/80 overflow-hidden">
                      <div className="p-4 bg-linear-to-br from-orange-50 to-rose-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-orange-400 via-rose-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1.5">
                        {[
                          {
                            href: "/dashboard",
                            icon: FiGrid,
                            label: "Dashboard",
                          },
                          {
                            href: "/dashboard/orders",
                            icon: FiPackage,
                            label: "My Orders",
                          },
                          {
                            href: "/dashboard/wishlist",
                            icon: FiHeart,
                            label: "Wishlist",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                          >
                            <item.icon size={16} className="text-gray-400" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="relative px-5 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/20 active:scale-95"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-orange-500 via-rose-500 to-orange-500 bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    <span className="relative">Get Started</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-0.5">
              <button
                onClick={() => {
                  setSearchExpanded(!searchExpanded);
                }}
                className="p-2.5 text-gray-600 hover:text-orange-500 rounded-xl transition-colors"
              >
                <FiSearch size={20} />
              </button>
              <Link
                href="/cart"
                className="relative p-2.5 text-gray-600 hover:text-orange-500 rounded-xl transition-colors"
              >
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-linear-to-r from-orange-500 to-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-gray-700 hover:text-orange-500 rounded-xl hover:bg-gray-100/60 transition-all ml-0.5"
              >
                <FiMenu size={22} />
              </button>
            </div>
          </div>

          {/* Desktop Bottom Nav */}
          <div className="hidden lg:flex items-center gap-0.5 -mb-px">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-linear-to-r from-orange-500 to-rose-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Expandable Search */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              searchExpanded ? "max-h-20 py-3" : "max-h-0 py-0"
            }`}
          >
            <form onSubmit={handleSearch} className="relative">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl text-sm bg-gray-100/80 border border-gray-200/60 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-500/15 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-bold text-white bg-linear-to-r from-orange-500 to-rose-500 rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-60 transition-all duration-300 ${
          isOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/unityshop.png"
                  alt="UnityShop"
                  width={120}
                  height={35}
                  className="object-contain"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Menu
              </p>
              <div className="space-y-0.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-linear-to-r from-orange-50 to-rose-50 text-orange-600"
                          : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          active
                            ? "bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/30"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon size={17} />
                      </div>
                      <span>{link.name}</span>
                      {active && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Quick Links for logged in users */}
              {user && (
                <>
                  <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">
                    Account
                  </p>
                  <div className="space-y-0.5">
                    {[
                      { href: "/dashboard", icon: FiGrid, label: "Dashboard" },
                      {
                        href: "/dashboard/orders",
                        icon: FiPackage,
                        label: "My Orders",
                      },
                      {
                        href: "/dashboard/wishlist",
                        icon: FiHeart,
                        label: "Wishlist",
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                          <item.icon size={17} />
                        </div>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom User Section */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/60">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-400 via-rose-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20 ring-2 ring-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role || "Customer"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <FiLogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-3 text-sm font-bold text-white bg-linear-to-r from-orange-500 to-rose-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                  >
                    Create Free Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
