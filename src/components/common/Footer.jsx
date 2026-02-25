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

const footerLinks = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Shop",
    links: [
      { href: "/products", label: "Products" },
      { href: "/categories", label: "Categories" },
      { href: "/deals", label: "Deals" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/faq", label: "FAQ" },
      { href: "/policies", label: "Policies" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top: Links + Contact */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Link columns */}
          <div className="flex gap-16">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
                  {col.title}
                </h4>
                <ul className="space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: Newsletter + Socials */}
          <div className="max-w-xs">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Stay updated
            </h4>
            <form className="flex mb-4" suppressHydrationWarning>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-l-full border border-gray-700 focus:outline-none focus:border-gray-500"
                suppressHydrationWarning
              />
              <button className="px-4 py-1.5 text-sm bg-white text-black font-semibold rounded-r-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 Unity Shop. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
