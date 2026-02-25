"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  { name: "home", href: "/", icon: FiHome },
  { name: "products", href: "/products", icon: FiShoppingBag },
  { name: "about", href: "/about", icon: FiInfo },
  { name: "contact", href: "/contact", icon: FiPhone },
];

const categoryLinks = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Kitchen",
  "Bedroom",
  "Office",
  "Mobiles",
  "Watches",
  "Audio",
  "Cameras",
  "Gaming",
  "Lighting",
  "Beauty",
  "Health",
  "Sports",
  "Outdoor",
  "Books",
  "Stationery",
  "Toys & Baby",
  "Grocery",
  "Tools",
  "Automotive",
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { language, setLanguage, t, languages } = useLanguage();
  const { currency, setCurrency, currencies, currentCurrency } = useCurrency();
  const router = useRouter();
  const pathname = usePathname();

  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  useClickOutside(langMenuRef, () => setShowLangMenu(false));
  useClickOutside(currencyMenuRef, () => setShowCurrencyMenu(false));

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const catParam =
        searchCategory !== "all"
          ? `&category=${encodeURIComponent(searchCategory)}`
          : "";
      router.push(
        `/products?q=${encodeURIComponent(searchQuery.trim())}${catParam}`,
      );
      setIsOpen(false);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav className="sticky top-0 z-50 hidden lg:block">
        {/* ── Row 1: Logo + Search + Actions ── */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-14 gap-4">
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/unityshop.png"
                  alt="UnityShop"
                  width={130}
                  height={36}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </Link>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="h-9 px-3 text-xs font-medium bg-gray-200 text-gray-800 border-0 rounded-l-lg outline-none cursor-pointer"
                >
                  <option value="all">
                    {t("all")} {t("categories")}
                  </option>
                  {categoryLinks.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchProducts")}
                  className="flex-1 h-9 px-4 text-sm bg-white text-gray-900 border-0 outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="h-9 px-4 bg-white text-black rounded-r-lg border-l border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <FiSearch size={16} />
                </button>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-1">
                {/* Favorites */}
                <Link
                  href="/dashboard/wishlist"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                >
                  <FiHeart size={18} />
                  <span className="text-sm font-medium hidden xl:inline">
                    {t("wishlist")}
                  </span>
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                >
                  <div className="relative">
                    <FiShoppingCart size={18} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden xl:inline ml-1">
                    {t("cart")}
                  </span>
                  <FiChevronDown
                    size={12}
                    className="hidden xl:block text-gray-400"
                  />
                </Link>

                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* My Account */}
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-500">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="hidden xl:block text-sm font-medium max-w-20 truncate">
                        {user.name?.split(" ")[0]}
                      </span>
                      <FiChevronDown
                        size={12}
                        className={`text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2.5 border-b border-gray-100">
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
                            label: t("dashboard"),
                          },
                          {
                            href: "/dashboard/orders",
                            icon: FiPackage,
                            label: t("myOrders"),
                          },
                          {
                            href: "/dashboard/wishlist",
                            icon: FiHeart,
                            label: t("wishlist"),
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
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
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <FiLogOut size={15} />
                            {t("signOut")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors text-sm font-medium"
                    >
                      <span className="hidden xl:inline">{t("signIn")}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Nav Links + Location + Language + Currency ── */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-10 justify-between">
              {/* Nav Links */}
              <div className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      isActive(link.href)
                        ? "text-white bg-gray-700"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t(link.name)}
                  </Link>
                ))}

                {/* Category quick links */}
                <div className="w-px h-4 bg-gray-700 mx-1.5" />
                {categoryLinks.slice(0, 6).map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="px-2.5 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              {/* Right: Currency + Language */}
              <div className="flex items-center gap-3">
                {/* Currency Switcher */}
                <div className="relative" ref={currencyMenuRef}>
                  <button
                    onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                    className="flex items-center gap-1.5 px-2 py-1 text-gray-300 hover:text-white rounded transition-colors text-sm"
                  >
                    <span className="text-base">{currentCurrency?.flag}</span>
                    <span className="font-medium">{currentCurrency?.code}</span>
                    <FiChevronDown
                      size={12}
                      className={`text-gray-500 transition-transform ${showCurrencyMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showCurrencyMenu && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-72 overflow-y-auto">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code);
                            setShowCurrencyMenu(false);
                          }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                            currency === curr.code
                              ? "bg-gray-100 text-black font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          <span className="text-base">{curr.flag}</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{curr.code}</div>
                            <div className="text-xs text-gray-400">
                              {curr.name}
                            </div>
                          </div>
                          {currency === curr.code && (
                            <span className="text-black">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-gray-700" />

                {/* Language Switcher */}
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1.5 px-2 py-1 text-gray-300 hover:text-white rounded transition-colors text-sm"
                  >
                    <span className="text-base">{currentLang.flag}</span>
                    <span className="font-medium">{currentLang.name}</span>
                    <FiChevronDown
                      size={12}
                      className={`text-gray-500 transition-transform ${showLangMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showLangMenu && (
                    <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                            language === lang.code
                              ? "bg-gray-100 text-black font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {language === lang.code && (
                            <span className="ml-auto text-black">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAVBAR ── */}
      <nav className="sticky top-0 z-50 lg:hidden bg-black">
        <div className="px-4">
          <div className="flex items-center h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={100}
                height={28}
                className="object-contain brightness-0 invert"
                priority
              />
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="flex-1 h-8 px-3 text-sm bg-gray-800 text-white border border-gray-700 rounded-l-lg outline-none placeholder:text-gray-500 focus:border-gray-500"
              />
              <button
                type="submit"
                className="h-8 px-3 bg-gray-200 text-black rounded-r-lg hover:bg-white transition-colors"
              >
                <FiSearch size={14} />
              </button>
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-300">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE SLIDE MENU ── */}
      <div
        className={`lg:hidden fixed inset-0 z-60 transition-all duration-300 ${
          isOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-gray-950 shadow-xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-800">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/unityshop.png"
                  alt="UnityShop"
                  width={100}
                  height={28}
                  className="object-contain brightness-0 invert"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-3 space-y-0.5">
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
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {t(link.name)}
                    </Link>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="px-3 py-2 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {t("categories")}
                </p>
                <div className="space-y-0.5">
                  {categoryLinks.slice(0, 12).map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {user && (
                <div className="px-3 py-2 border-t border-gray-800">
                  <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </p>
                  <div className="space-y-0.5">
                    {[
                      {
                        href: "/dashboard",
                        icon: FiGrid,
                        label: t("dashboard"),
                      },
                      {
                        href: "/dashboard/orders",
                        icon: FiPackage,
                        label: t("myOrders"),
                      },
                      {
                        href: "/dashboard/wishlist",
                        icon: FiHeart,
                        label: t("wishlist"),
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800/60 hover:text-white transition-colors"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency Switcher - Mobile */}
              <div className="px-3 py-3 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {t("currency")}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currency === curr.code
                          ? "bg-white text-black font-semibold"
                          : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                      }`}
                    >
                      <span>{curr.flag}</span>
                      <span className="truncate">{curr.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switcher - Mobile */}
              <div className="px-3 py-3 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {t("language")}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === lang.code
                          ? "bg-white text-black font-semibold"
                          : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: User / Auth */}
            <div className="p-4 border-t border-gray-800">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold ring-2 ring-gray-600">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role || t("customer")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <FiLogOut size={15} />
                    {t("signOut")}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t("register")}
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
