"use client";
import { useState, useRef, useEffect } from "react";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaBell,
  FaGlobe,
} from "react-icons/fa";
import { FiUser, FiLogOut, FiSettings, FiPackage } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Shipped",
    message: "Your order #1234 has been shipped and is on the way!",
    time: "2 hours ago",
    unread: true,
    icon: "📦",
  },
  {
    id: 2,
    title: "New Promotion",
    message: "Get 25% off on all Living Room items this weekend!",
    time: "5 hours ago",
    unread: true,
    icon: "🎉",
  },
  {
    id: 3,
    title: "Price Drop Alert",
    message: "Bouclé Accent Chair is now $320 (was $420)",
    time: "1 day ago",
    unread: false,
    icon: "📉",
  },
  {
    id: 4,
    title: "Back in Stock",
    message: "Wabi-Sabi Table Lamp you wishlisted is available again",
    time: "2 days ago",
    unread: false,
    icon: "✨",
  },
];

// Language options
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

// Demo user (for testing - replace with real auth)
const DEMO_USER = {
  id: "demo-user-1",
  name: "Raihan Chowdhoury",
  email: "raihan@unityshop.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  role: "user", // can be: 'user', 'seller', 'manager', 'admin'
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  // Demo: Toggle this to true to see logged-in state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(DEMO_USER);

  const notifRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLanguages(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    setShowLanguages(false);
    // TODO: Implement actual i18n translation logic here
    console.log("Language changed to:", code);
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    setIsLoggedIn(false);
    setUser(null);
    // TODO: Implement actual logout logic (clear session, redirect, etc.)
    console.log("User logged out");
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <nav className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ===== Logo Section ===== */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition duration-300">
            <Image
              src="https://res.cloudinary.com/djss04any/image/upload/v1771322540/logo_yifd93.jpg"
              alt="Unity-Shop Logo"
              className="object-cover h-8 w-8"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-white">Unity</span>
            <span className="text-blue-800">Shop</span>
          </h1>
        </Link>

        {/* ===== Desktop Menu ===== */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-gray-200 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-200 transition">
            Shop
          </Link>
          <Link href="/about" className="hover:text-gray-200 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-200 transition">
            Contact
          </Link>
        </div>

        {/* ===== Icons Section ===== */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language Selector */}
          <div className="relative hidden md:block" ref={langRef}>
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="bg-white text-orange-500 p-2 rounded-full shadow-md hover:scale-110 transition duration-300 flex items-center gap-1"
              title="Change Language"
            >
              <FaGlobe size={20} />
            </button>

            {/* Language Dropdown */}
            {showLanguages && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Select Language
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2.5 text-left hover:bg-orange-50 transition flex items-center gap-3 ${
                        selectedLanguage === lang.code ? "bg-orange-50" : ""
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span
                        className={`text-sm ${selectedLanguage === lang.code ? "font-semibold text-orange-600" : "text-gray-700"}`}
                      >
                        {lang.name}
                      </span>
                      {selectedLanguage === lang.code && (
                        <span className="ml-auto text-orange-500 text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative hidden md:block" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-white text-orange-500 p-2 rounded-full shadow-md hover:scale-110 transition duration-300 relative"
              title="Notifications"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                      <div className="text-4xl mb-2">🔔</div>
                      <p className="text-sm text-gray-500">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 cursor-pointer ${
                          notif.unread ? "bg-orange-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {notif.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-semibold text-gray-800 leading-tight ${notif.unread ? "text-gray-900" : ""}`}
                              >
                                {notif.title}
                              </p>
                              {notif.unread && (
                                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <Link
                    href="/notifications"
                    className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="bg-white text-orange-500 p-2 rounded-full shadow-md hover:scale-110 transition duration-300"
          >
            <FaShoppingCart size={20} />
          </Link>

          {/* User Dropdown or Login Button */}
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={userRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 focus:outline-none group"
                title={user?.name}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/50 group-hover:ring-white transition-all duration-300 shadow-md">
                    <Image
                      src={
                        user?.avatar ||
                        "https://i.ibb.co.com/0s3pdnc/avatar.png"
                      }
                      alt={user?.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  {/* User Info Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-orange-50 to-white">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-orange-500/30 shadow-md flex-shrink-0">
                        <Image
                          src={
                            user?.avatar ||
                            "https://i.ibb.co.com/0s3pdnc/avatar.png"
                          }
                          alt={user?.name || "User"}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-lg">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 text-gray-700 group"
                    >
                      <FiUser className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard/orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 text-gray-700 group"
                    >
                      <FiPackage className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <span className="font-medium">My Orders</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 text-gray-700 group"
                    >
                      <FiSettings className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    <div className="my-2 border-t border-gray-100"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-all duration-200 group"
                    >
                      <FiLogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block bg-white text-orange-500 px-8 py-1 rounded-full font-medium hover:bg-orange-50 transition"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </div>
        </div>
      </div>

      {/* ===== Mobile Menu ===== */}
      {isOpen && (
        <div className="md:hidden bg-white text-gray-800 px-6 pb-4 space-y-3 shadow-lg">
          {/* User Info in Mobile (if logged in) */}
          {isLoggedIn && user && (
            <div className="flex items-center gap-3 py-4 border-b border-gray-200">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-orange-500/30 shadow-md flex-shrink-0">
                <Image
                  src={user.avatar || "https://i.ibb.co.com/0s3pdnc/avatar.png"}
                  alt={user.name || "User"}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="block py-2 hover:text-orange-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block py-2 hover:text-orange-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="block py-2 hover:text-orange-500 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-orange-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* Logged-in User Menu Items */}
          {isLoggedIn && (
            <>
              <div className="pt-3 border-t border-gray-200">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500 transition"
                >
                  <FiUser size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500 transition"
                >
                  <FiPackage size={16} />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500 transition"
                >
                  <FiSettings size={16} />
                  <span>Settings</span>
                </Link>
              </div>
            </>
          )}

          {/* Mobile Notifications */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-orange-500 transition w-full"
            >
              <FaBell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-auto">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Language */}
          <div>
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-orange-500 transition w-full"
            >
              <FaGlobe size={16} />
              <span>Language: {currentLang?.name}</span>
            </button>
            {showLanguages && (
              <div className="pl-6 space-y-2 mt-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-2 py-1 text-sm w-full ${
                      selectedLanguage === lang.code
                        ? "text-orange-500 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full text-center bg-red-500 text-white px-8 py-2 rounded-full font-medium hover:bg-red-600 transition mt-4"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-center bg-orange-500 text-white px-8 py-2 rounded-full font-medium hover:bg-orange-600 transition mt-4"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
