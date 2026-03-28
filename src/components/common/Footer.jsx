// components/common/Footer.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
  FiArrowRight,
} from "react-icons/fi";

const socials = [
  { Icon: FiFacebook, href: "#", label: "Facebook" },
  { Icon: FiTwitter, href: "#", label: "Twitter" },
  { Icon: FiInstagram, href: "#", label: "Instagram" },
  { Icon: FiLinkedin, href: "#", label: "LinkedIn" },
  { Icon: FiYoutube, href: "#", label: "YouTube" },
];

const columns = [
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
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-8 border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Grid: Logo/Newsletter + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Left Column: Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={140}
                height={36}
                className="object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Quality products. Global reach. Shopping you can trust — seamlessly connecting buyers and verified sellers since 2023.
            </p>

            <div className="w-full max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">
                Subscribe to our newsletter
              </p>
              {sent ? (
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 py-3 px-5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Thanks for subscribing!
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative group"
                  suppressHydrationWarning
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    suppressHydrationWarning
                    className="w-full bg-transparent border border-white/20 hover:border-white/40 rounded-xl px-5 py-3.5 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/5 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    <FiArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Columns: Links */}
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-6">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-xs flex flex-col sm:flex-row items-center gap-4">
            <p>© {new Date().getFullYear()} UnityShop. All rights reserved.</p>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

