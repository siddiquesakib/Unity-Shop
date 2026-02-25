"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationContext";
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
  FiGlobe,
  FiUser,
  FiMapPin,
  FiBell,
  FiStar,
  FiCheckCircle,
  FiCreditCard,
  FiTruck,
  FiTag,
  FiTrash2,
} from "react-icons/fi";

// ─── Time ago helper ────────────────────────────────────────────────────────
function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

// ─── Notification style config ──────────────────────────────────────────────
const NOTIF_CONFIG = {
  cart_add: {
    icon: FiShoppingCart,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    label: "Cart",
  },
  payment_success: {
    icon: FiCreditCard,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    label: "Payment",
  },
  order_confirmed: {
    icon: FiCheckCircle,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Order",
  },
  order_status: {
    icon: FiTruck,
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    label: "Order",
  },
  product_approved: {
    icon: FiCheckCircle,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    label: "Product",
  },
  product_rejected: {
    icon: FiX,
    bg: "bg-red-50",
    iconColor: "text-red-500",
    label: "Product",
  },
  seller_approved: {
    icon: FiStar,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    label: "Seller",
  },
  seller_rejected: {
    icon: FiX,
    bg: "bg-red-50",
    iconColor: "text-red-500",
    label: "Seller",
  },
  coupon: {
    icon: FiTag,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    label: "Promo",
  },
};
const DEFAULT_NOTIF = {
  icon: FiBell,
  bg: "bg-gray-100",
  iconColor: "text-gray-500",
  label: "",
};

const navLinks = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Products", href: "/products", icon: FiShoppingBag },
  { name: "About", href: "/about", icon: FiInfo },
  { name: "Contact", href: "/contact", icon: FiPhone },
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
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, logout } = useAuth();
  const { totalUniqueItems: totalItems } = useCart();
  const { language, setLanguage, t, languages } = useLanguage();
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications() || {};

  // Debug
  useEffect(() => {
    console.log("Navbar notifications updated:", notifications);
  }, [notifications]);

  const router = useRouter();

  const pathname = usePathname();

  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  useClickOutside(langMenuRef, () => setShowLangMenu(false));
  useClickOutside(notifRef, () => setShowNotifications(false));

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
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                  >
                    <div className="relative">
                      <FiBell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-3.5 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <span className="min-w-5 h-5 px-1.5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-105 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                          notifications.map((n) => {
                            const cfg = NOTIF_CONFIG[n.type] || DEFAULT_NOTIF;
                            const Icon = cfg.icon;

                            return (
                              <div
                                key={n._id}
                                className={`group relative flex items-start gap-3 px-5 py-3.5 transition-all cursor-pointer ${
                                  !n.read
                                    ? "bg-blue-50/40 hover:bg-blue-50/70"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => markAsRead(n._id)}
                              >
                                {/* Delete button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(n._id);
                                  }}
                                  className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  title="Delete"
                                >
                                  <FiTrash2 size={13} />
                                </button>

                                {/* Icon */}
                                <div
                                  className={`mt-0.5 w-9 h-9 rounded-xl ${cfg.bg} ${cfg.iconColor} flex items-center justify-center shrink-0`}
                                >
                                  <Icon size={16} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-6">
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-900" : "font-medium text-gray-600"}`}
                                    >
                                      {n.title || n.text}
                                    </p>
                                    {!n.read && (
                                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                    )}
                                  </div>
                                  {n.message && (
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                      {n.message}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1.5">
                                    {cfg.label && (
                                      <span
                                        className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.iconColor}`}
                                      >
                                        {cfg.label}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-400">
                                      {timeAgo(n.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-5 py-12 text-center">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center">
                              <FiBell size={24} className="text-gray-300" />
                            </div>
                            {user ? (
                              <>
                                <p className="text-sm font-medium text-gray-400">
                                  No notifications yet
                                </p>
                                <p className="text-xs text-gray-300 mt-1">
                                  We&apos;ll notify you when something arrives
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-gray-400">
                                  Sign in to see notifications
                                </p>
                                <Link
                                  href="/login"
                                  onClick={() => setShowNotifications(false)}
                                  className="inline-block mt-2 text-xs font-medium text-black bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors"
                                >
                                  Sign In
                                </Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                      <FiUser size={18} />
                      <span className="hidden xl:inline">{t("signIn")}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Nav Links + Location + Language ── */}
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
                    {t(link.name.toLowerCase())}
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

              {/* Right: Language */}
              <div className="flex items-center gap-3">
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

            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-300"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-3.5 h-3.5 px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Notification Dropdown */}
              {showNotifications && (
                <div className="fixed inset-x-0 top-14 mx-3 bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden max-h-[70vh] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-gray-50 to-white border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-black"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => {
                        const cfg = NOTIF_CONFIG[n.type] || DEFAULT_NOTIF;
                        const Icon = cfg.icon;

                        return (
                          <div
                            key={n._id}
                            className={`group relative flex items-start gap-3 px-4 py-3 transition-all cursor-pointer ${
                              !n.read ? "bg-blue-50/40" : ""
                            }`}
                            onClick={() => markAsRead(n._id)}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n._id);
                              }}
                              className="absolute top-2.5 right-3 p-1 text-gray-300 hover:text-red-500"
                            >
                              <FiTrash2 size={13} />
                            </button>

                            <div
                              className={`mt-0.5 w-8 h-8 rounded-lg ${cfg.bg} ${cfg.iconColor} flex items-center justify-center shrink-0`}
                            >
                              <Icon size={14} />
                            </div>

                            <div className="flex-1 min-w-0 pr-6">
                              <div className="flex items-center gap-1.5">
                                <p
                                  className={`text-[13px] leading-snug ${!n.read ? "font-semibold text-gray-900" : "text-gray-600"}`}
                                >
                                  {n.title || n.text}
                                </p>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                )}
                              </div>
                              {n.message && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                              )}
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {timeAgo(n.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-10 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-100 flex items-center justify-center">
                          <FiBell size={20} className="text-gray-300" />
                        </div>
                        {user ? (
                          <p className="text-sm text-gray-400">
                            No notifications yet
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-400">
                              Sign in to see notifications
                            </p>
                            <Link
                              href="/login"
                              onClick={() => {
                                setShowNotifications(false);
                                setIsOpen(false);
                              }}
                              className="inline-block mt-2 text-xs font-medium text-black bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors"
                            >
                              Sign In
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                      {t(link.name.toLowerCase())}
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
                  {categoryLinks.map((cat) => (
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
