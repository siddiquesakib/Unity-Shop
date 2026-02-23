// components/common/Footer.jsx
"use client";

import Link from "next/link";
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-16 pb-8 glass bg-base-200 border-t border-base-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">
              About Unity Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-orange-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-orange-400 transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-400 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-orange-400 transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="hover:text-orange-400 transition"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Buy */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Buy on Unity Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rfq" className="hover:text-orange-400 transition">
                  Request for Quotation
                </Link>
              </li>
              <li>
                <Link
                  href="/trade-assurance"
                  className="hover:text-orange-400 transition"
                >
                  Trade Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-orange-400 transition"
                >
                  Product Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-orange-400 transition"
                >
                  Search Products
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="hover:text-orange-400 transition"
                >
                  Deals & Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sell */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Sell on Unity Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/become-seller"
                  className="hover:text-orange-400 transition"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers/dashboard"
                  className="hover:text-orange-400 transition"
                >
                  Seller Central
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers/verification"
                  className="hover:text-orange-400 transition"
                >
                  Become Verified
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers/resources"
                  className="hover:text-orange-400 transition"
                >
                  Seller Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers/pricing"
                  className="hover:text-orange-400 transition"
                >
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-orange-400 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/disputes"
                  className="hover:text-orange-400 transition"
                >
                  Dispute Resolution
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-orange-400 transition"
                >
                  Report Abuse
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="hover:text-orange-400 transition"
                >
                  Policies
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-400 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                <FiYoutube size={20} />
              </a>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="text-orange-400" />
                <span>support@unityshop.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-orange-400" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-orange-400" />
                <span>123 Market St, San Francisco, CA</span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-2">
                Download App
              </h4>
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-xs"
                >
                  App Store
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-xs"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-lg font-semibold">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-gray-400">
                Get the latest deals and offers
              </p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
              />
              <button className="px-6 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2026 Unity Shop. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-orange-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-orange-400 transition">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-orange-400 transition">
              Sitemap
            </Link>
            <select className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
            <select className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
              <option>CNY (¥)</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
