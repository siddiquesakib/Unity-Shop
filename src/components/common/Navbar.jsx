"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  FiMic,
  FiLayers,
} from "react-icons/fi";
import CustomLanguageSwitcher from "@/components/CustomLanguageSwitcher";

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

// ─── Notification config ────────────────────────────────────────────────────
const NOTIF_CONFIG = {
  cart_add: {
    icon: FiShoppingCart,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Cart",
  },
  payment_success: {
    icon: FiCreditCard,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Payment",
  },
  order_confirmed: {
    icon: FiCheckCircle,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Order",
  },
  order_status: {
    icon: FiTruck,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Order",
  },
  product_approved: {
    icon: FiCheckCircle,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Product",
  },
  product_rejected: {
    icon: FiX,
    bg: "bg-gray-100",
    iconColor: "text-gray-500",
    label: "Product",
  },
  seller_approved: {
    icon: FiStar,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
    label: "Seller",
  },
  seller_rejected: {
    icon: FiX,
    bg: "bg-gray-100",
    iconColor: "text-gray-500",
    label: "Seller",
  },
  coupon: {
    icon: FiTag,
    bg: "bg-gray-100",
    iconColor: "text-gray-700",
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

const categoryChips = [
  {
    label: "ইলেকট্রনিক্স",
    labelEn: "Electronics",
    value: "Electronics",
    icon: "💻",
  },
  { label: "ফ্যাশন", labelEn: "Fashion", value: "Fashion", icon: "👗" },
  {
    label: "হোম",
    labelEn: "Home & Living",
    value: "Home & Living",
    icon: "🏠",
  },
  { label: "বিউটি", labelEn: "Beauty", value: "Beauty", icon: "💄" },
  { label: "গ্রোসারি", labelEn: "Grocery", value: "Grocery", icon: "🛒" },
  { label: "বেবি", labelEn: "Toys & Baby", value: "Toys & Baby", icon: "🧸" },
  { label: "স্পোর্টস", labelEn: "Sports", value: "Sports", icon: "⚽" },
  { label: "মোবাইল", labelEn: "Mobiles", value: "Mobiles", icon: "📱" },
  { label: "ওয়াচ", labelEn: "Watches", value: "Watches", icon: "⌚" },
  { label: "গেমিং", labelEn: "Gaming", value: "Gaming", icon: "🎮" },
  { label: "বুকস", labelEn: "Books", value: "Books", icon: "📚" },
  { label: "অটো", labelEn: "Automotive", value: "Automotive", icon: "🚗" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Autocomplete Search Hook ───────────────────────────────────────────────
function useAutocomplete(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=6`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { user, logout } = useAuth();
  const { totalUniqueItems: totalItems } = useCart();
  const { currency, setCurrency, currencies, currentCurrency } = useCurrency();
  const { language, setLanguage, t, languages } = useLanguage();
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications() || {};

  const { results: autocompleteResults, loading: autocompleteLoading } =
    useAutocomplete(showAutocomplete ? searchQuery : "");

  const router = useRouter();
  const pathname = usePathname();

  const userMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  useClickOutside(currencyMenuRef, () => setShowCurrencyMenu(false));
  useClickOutside(notifRef, () => setShowNotifications(false));
  useClickOutside(searchRef, () => setShowAutocomplete(false));

  useEffect(() => {
    document.body.style.overflow = isOpen || showMobileSearch ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, showMobileSearch]);

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
      setShowMobileSearch(false);
      setShowAutocomplete(false);
    }
  };

  // Voice search
  const startVoiceSearch = useCallback(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    )
      return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchQuery(transcript);
      setShowAutocomplete(true);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const formatPrice = (price) => {
    return `৳${price?.toLocaleString() || 0}`;
  };

  const getSafeImage = (product) => {
    const img = Array.isArray(product.image) ? product.image[0] : product.image;
    if (
      img &&
      typeof img === "string" &&
      img.trim() &&
      !img.startsWith("data:")
    ) {
      try {
        new URL(img);
        return img;
      } catch {
        return null;
      }
    }
    return null;
  };

  // ─── DESKTOP ──────────────────────────────────────────────────────────────
  return (
    <>
      <nav className="sticky top-0 z-50 hidden lg:block">
        {/* ═══ Row 1: Logo + Search + Actions ═══ */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-6">
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

              {/* ── Search Bar (prominent, centered) ── */}
              <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="flex">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="h-10 px-3 text-xs font-medium bg-gray-100 text-gray-700 border-0 rounded-l-xl outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <option value="all">All</option>
                    {categoryLinks.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowAutocomplete(true);
                      }}
                      onFocus={() => setShowAutocomplete(true)}
                      placeholder="কি খুঁজছেন? ফোন, জামা, ব্যাগ..."
                      className="w-full h-10 px-4 text-sm bg-white text-gray-900 border-0 outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`h-10 px-3 bg-white border-l border-gray-200 transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-gray-700"}`}
                    title="Voice search"
                  >
                    <FiMic size={16} />
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-black hover:bg-gray-800 text-white font-semibold rounded-r-xl transition-colors"
                  >
                    <FiSearch size={18} />
                  </button>
                </form>

                {/* ── Autocomplete Dropdown ── */}
                {showAutocomplete && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {autocompleteLoading ? (
                      <div className="px-4 py-6 text-center">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto" />
                      </div>
                    ) : autocompleteResults.length > 0 ? (
                      <>
                        {autocompleteResults.map((product) => {
                          const img = getSafeImage(product);
                          return (
                            <Link
                              key={product._id}
                              href={`/products/${product._id}`}
                              onClick={() => {
                                setShowAutocomplete(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                {img ? (
                                  <Image
                                    src={img}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <FiShoppingBag
                                    size={16}
                                    className="text-gray-300"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 truncate font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {product.category}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-black shrink-0">
                                {formatPrice(product.price)}
                              </span>
                            </Link>
                          );
                        })}
                        <Link
                          href={`/products?q=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => {
                            setShowAutocomplete(false);
                          }}
                          className="block px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 border-t border-gray-100 transition-colors"
                        >
                          সব রেজাল্ট দেখুন →
                        </Link>
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        &quot;{searchQuery}&quot; এর কোনো ফলাফল নেই
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Right Actions ── */}
              <div className="flex items-center gap-1">
                {/* Language */}
                <CustomLanguageSwitcher />

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                  >
                    <div className="relative">
                      <FiBell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-black">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
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
                      <div className="max-h-105 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                          notifications.map((n) => {
                            const cfg = NOTIF_CONFIG[n.type] || DEFAULT_NOTIF;
                            const Icon = cfg.icon;
                            return (
                              <div
                                key={n._id}
                                className={`group relative flex items-start gap-3 px-5 py-3.5 transition-all cursor-pointer ${!n.read ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-gray-50"}`}
                                onClick={() => markAsRead(n._id)}
                              >
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
                                <div
                                  className={`mt-0.5 w-9 h-9 rounded-xl ${cfg.bg} ${cfg.iconColor} flex items-center justify-center shrink-0`}
                                >
                                  <Icon size={16} />
                                </div>
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
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
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

                {/* Wishlist */}
                <Link
                  href="/dashboard/wishlist"
                  className="flex items-center gap-1.5 px-2 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                >
                  <FiHeart size={20} />
                  <span className="text-sm font-medium hidden xl:inline">
                    Wishlist
                  </span>
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="flex items-center gap-1.5 px-2 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors relative"
                >
                  <div className="relative">
                    <FiShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2.5 min-w-4.5 h-4.5 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-black">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden xl:inline ml-1">
                    Cart
                  </span>
                </Link>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Account */}
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:text-white rounded-md transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold ring-2 ring-gray-600">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="hidden xl:block text-left">
                        <p className="text-[10px] text-gray-400 leading-none">
                          Welcome
                        </p>
                        <p className="text-sm font-semibold text-white max-w-20 truncate leading-tight">
                          {user.name?.split(" ")[0]}
                        </p>
                      </div>
                      <FiChevronDown
                        size={12}
                        className={`text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 truncate">
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
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
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
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <FiLogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-200 text-black font-semibold text-sm rounded-lg transition-colors"
                  >
                    <FiUser size={16} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Row 2: Nav Links + Category Chips ═══ */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-10 justify-between">
              {/* Nav Links */}
              <div className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors inline-flex items-center ${
                      isActive(link.href)
                        ? "text-white bg-gray-700"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="w-px h-4 bg-gray-700 mx-1.5" />

                {/* Category Chips */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  {categoryChips.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/products?category=${encodeURIComponent(cat.value)}`}
                      className="px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap inline-flex items-center gap-1"
                    >
                      <span className="text-[11px]">{cat.icon}</span>
                      {cat.labelEn}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Currency */}
              <div className="flex items-center gap-3">
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
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${currency === curr.code ? "bg-gray-100 text-black font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
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
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE NAVBAR ────────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 lg:hidden bg-black">
        <div className="px-3 sm:px-4">
          <div className="flex items-center h-14 gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-300 hover:text-white transition-colors shrink-0 p-1"
            >
              <FiMenu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={100}
                height={28}
                className="object-contain brightness-0 invert h-6 sm:h-7 w-auto"
                priority
              />
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search (opens fullscreen) */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="text-gray-300 hover:text-white p-1.5"
            >
              <FiSearch size={20} />
            </button>

            {/* Notification */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-300 p-1.5"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-300 shrink-0 p-1.5"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Fullscreen Search ── */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-100 bg-white lg:hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 h-14 border-b border-gray-200">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-gray-500"
            >
              <FiX size={22} />
            </button>
            <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                placeholder="কি খুঁজছেন? ফোন, জামা, ব্যাগ..."
                className="flex-1 h-10 px-3 text-base text-gray-900 bg-gray-100 rounded-l-xl outline-none placeholder:text-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`h-10 px-3 bg-gray-100 border-l border-gray-200 ${isListening ? "text-red-500 animate-pulse" : "text-gray-400"}`}
              >
                <FiMic size={18} />
              </button>
              <button
                type="submit"
                className="h-10 px-4 bg-black text-white rounded-r-xl font-semibold"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          {/* Mobile autocomplete results */}
          <div className="flex-1 overflow-y-auto">
            {autocompleteLoading && searchQuery.trim().length >= 2 ? (
              <div className="py-12 text-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : searchQuery.trim().length >= 2 &&
              autocompleteResults.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {autocompleteResults.map((product) => {
                  const img = getSafeImage(product);
                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      onClick={() => {
                        setShowMobileSearch(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {img ? (
                          <Image
                            src={img}
                            alt=""
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <FiShoppingBag size={18} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.category}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-black">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  );
                })}
                <Link
                  href={`/products?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setShowMobileSearch(false)}
                  className="block px-4 py-3 text-center text-sm font-medium text-gray-900"
                >
                  সব রেজাল্ট দেখুন →
                </Link>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                কোনো ফলাফল নেই
              </div>
            ) : (
              <div className="px-4 py-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryChips.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/products?category=${encodeURIComponent(cat.value)}`}
                      onClick={() => setShowMobileSearch(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Slide Menu ── */}
      <div
        className={`lg:hidden fixed inset-0 z-70 transition-all duration-300 ${isOpen ? "visible" : "invisible pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-70 bg-gray-950 shadow-xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/60 hover:text-white"}`}
                    >
                      <Icon size={16} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="px-3 py-2 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800/60 hover:text-white transition-colors"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency */}
              <div className="px-3 py-3 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Currency
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${currency === curr.code ? "bg-white text-black font-semibold" : "text-gray-400 hover:bg-gray-800/60 hover:text-white"}`}
                    >
                      <span>{curr.flag}</span>
                      <span className="truncate">{curr.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="px-3 py-3 border-t border-gray-800">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Language
                </p>
                <CustomLanguageSwitcher />
              </div>
            </div>

            {/* Bottom: Auth */}
            <div className="p-4 border-t border-gray-800">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black text-sm font-bold ring-2 ring-gray-600">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
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
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
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
                    className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {[
            { href: "/", icon: FiHome, label: "Home" },
            {
              href: "/products",
              icon: FiLayers,
              label: "Categories",
              action: null,
            },
            {
              href: "/cart",
              icon: FiShoppingCart,
              label: "Cart",
              badge: totalItems,
            },
            {
              href: user ? "/dashboard" : "/login",
              icon: FiUser,
              label: user ? "Account" : "Login",
            },
          ].map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1.5 transition-colors ${active ? "text-black" : "text-gray-400"}`}
              >
                <div className="relative">
                  <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom nav spacer for mobile */}
      <div className="h-14 lg:hidden" />
    </>
  );
};

export default Navbar;
