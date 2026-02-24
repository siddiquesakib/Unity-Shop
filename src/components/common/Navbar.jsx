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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const userMenuRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));

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
      setIsOpen(false);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            {/* Logo */}
            <Link href="/" className="shrink-0 mr-6">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={120}
                height={35}
                className="object-contain"
                priority
              />
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search - Desktop */}
            <div className="hidden lg:block flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-200 outline-none transition-colors"
                />
              </form>
            </div>

            {/* Right Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-1 ml-4">
              <Link
                href="/dashboard/wishlist"
                className="p-2 text-gray-500 hover:text-rose-500 rounded-md hover:bg-gray-50 transition-colors"
                title="Wishlist"
              >
                <FiHeart size={18} />
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-gray-500 hover:text-orange-500 rounded-md hover:bg-gray-50 transition-colors"
                title="Cart"
              >
                <FiShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              <div className="w-px h-5 bg-gray-200 mx-1.5" />

              {/* User */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                      showUserMenu ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-20 truncate">
                      {user.name?.split(" ")[0]}
                    </span>
                    <FiChevronDown
                      size={13}
                      className={`text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
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
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                        >
                          <item.icon size={15} className="text-gray-400" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-0.5 ml-auto">
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 rounded-md"
              >
                <FiShoppingCart size={19} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-60 transition-all duration-300 ${
          isOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/unityshop.png"
                  alt="UnityShop"
                  width={100}
                  height={30}
                  className="object-contain"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-300 outline-none transition-colors"
                />
              </form>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-3">
              <div className="space-y-0.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-orange-500" : "text-gray-400"}
                      />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {user && (
                <>
                  <div className="h-px bg-gray-100 my-3" />
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <item.icon size={16} className="text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom */}
            <div className="p-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user.role || "Customer"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FiLogOut size={15} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Register
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
