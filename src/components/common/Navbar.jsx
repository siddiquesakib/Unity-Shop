"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiBell,
  FiGlobe,
  FiChevronDown,
  FiHeart,
} from "react-icons/fi";

const categories = [
  {
    name: "Electronics",
    icon: "📱",
    subcategories: [
      "Mobile Phones",
      "Laptops & Computers",
      "Cameras",
      "Audio & Headphones",
      "TV & Video",
      "Wearable Tech",
    ],
  },
  {
    name: "Fashion",
    icon: "👗",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Fashion",
      "Shoes",
      "Bags & Accessories",
      "Watches",
    ],
  },
  {
    name: "Home & Garden",
    icon: "🏠",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bedding & Bath",
      "Gardening",
      "Tools",
    ],
  },
  {
    name: "Health & Beauty",
    icon: "💄",
    subcategories: [
      "Makeup",
      "Skincare",
      "Hair Care",
      "Personal Care",
      "Vitamins & Supplements",
    ],
  },
  {
    name: "Sports & Outdoors",
    icon: "⚽",
    subcategories: [
      "Sports Equipment",
      "Camping & Hiking",
      "Fitness",
      "Cycling",
      "Fishing",
    ],
  },
  {
    name: "Toys & Kids",
    icon: "🧸",
    subcategories: [
      "Toys",
      "Baby Products",
      "Kids Furniture",
      "Educational",
      "Video Games",
    ],
  },
  {
    name: "Automotive",
    icon: "🚗",
    subcategories: [
      "Car Parts",
      "Motorcycle",
      "Tools & Equipment",
      "Car Care",
      "Accessories",
    ],
  },
  {
    name: "Office Supplies",
    icon: "📎",
    subcategories: [
      "Office Furniture",
      "Stationery",
      "Printers & Scanners",
      "Business Electronics",
    ],
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { data: session } = useSession();
  const { totalItems } = useCart();
  const router = useRouter();

  const navbarRef = useRef(null);
  const searchRef = useRef(null);
  const categoryRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns when clicking outside
  useClickOutside(searchRef, () => setShowSuggestions(false));
  useClickOutside(categoryRef, () => setShowCategoryMenu(false));
  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(langRef, () => setShowLangMenu(false));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`,
      );
      setShowSuggestions(false);
    }
  };

  // Dummy suggestions
  const suggestions = [
    "wireless headphones",
    "smart watch",
    "gaming laptop",
    "running shoes",
    "coffee maker",
  ];

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 sticky top-0 z-50 backdrop-blur-xl bg-base-100/80 border-b border-base-300 shadow-lg"
          : "bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Unity Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Categories Mega Menu */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <span>Categories</span>
                <FiChevronDown
                  className={`transition-transform ${showCategoryMenu ? "rotate-180" : ""}`}
                />
              </button>

              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-2 w-200 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 animate-fade-down">
                  <div className="grid grid-cols-4 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.name} className="space-y-3">
                        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <ul className="space-y-2">
                          {cat.subcategories.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/categories/${cat.name.toLowerCase()}/${sub
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                                onClick={() => setShowCategoryMenu(false)}
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-12 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border-t border-b border-gray-300 bg-gray-50 text-sm focus:outline-none"
                >
                  <option>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-r-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Search
                </button>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  {suggestions
                    .filter((s) =>
                      s.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSearchQuery(s);
                          setShowSuggestions(false);
                          router.push(`/search?q=${encodeURIComponent(s)}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <FiGlobe size={20} />
                </button>
                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                      English
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                      Spanish
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                      French
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                      German
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                      Chinese
                    </button>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <FiUser size={20} />
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    {session ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          className="block px-4 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/dashboard/wishlist"
                          className="block px-4 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Wishlist
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-700 hover:text-orange-500 transition-colors relative"
                >
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <div className="px-4 py-2 font-semibold border-b">
                      Notifications
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b">
                        <p className="text-sm font-medium">Order Shipped</p>
                        <p className="text-xs text-gray-500">
                          Your order #12345 has been shipped.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 border-b">
                        <p className="text-sm font-medium">Price Drop Alert</p>
                        <p className="text-xs text-gray-500">
                          Wireless Headphones are now 20% off!
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Link
                      href="/notifications"
                      className="block px-4 py-2 text-center text-sm text-orange-500 hover:bg-gray-50"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All
                    </Link>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-orange-500 transition-colors relative"
              >
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link href="/cart" className="p-2 text-gray-700 relative">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Unity Shop
              </span>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <FiX size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-r-full"
                onClick={() => setIsOpen(false)}
              >
                <FiSearch />
              </button>
            </form>

            {/* Mobile Categories Accordion */}
            <div className="space-y-4">
              <div className="font-semibold text-gray-900">Categories</div>
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-800">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <div className="pl-8 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/categories/${cat.name.toLowerCase()}/${sub
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block text-sm text-gray-600 hover:text-orange-500"
                        onClick={() => setIsOpen(false)}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile User Links */}
            <div className="space-y-2 pt-4 border-t">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block py-2 text-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/dashboard/wishlist"
                    className="block py-2 text-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-500 hover:text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
