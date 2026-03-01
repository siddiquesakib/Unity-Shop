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
    <footer className="bg-black text-white overflow-hidden">
      {/* ── TOP STATEMENT ──────────────────────────────── */}
      <div className="border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* oversized wordmark */}
          <div className="overflow-hidden">
            <Link href="/" className="block mb-2">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={130}
                height={32}
                className="object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm text-white/40 max-w-xs leading-relaxed">
              Quality products. Global reach. Shopping you can trust — since
              2023.
            </p>
          </div>

          {/* newsletter right-aligned */}
          <div className="w-full md:w-auto md:min-w-[300px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-3">
              Get our newsletter
            </p>
            {sent ? (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
                You're subscribed. Thanks!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative"
                suppressHydrationWarning
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  suppressHydrationWarning
                  className="w-full bg-white/[0.06] border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  <FiArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── LINKS + SOCIALS ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-10">
          {/* link columns */}
          <div className="flex flex-wrap gap-x-14 gap-y-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* socials side by side */}
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group flex items-center gap-2.5 text-white/30 hover:text-white transition-colors duration-200"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 group-hover:border-white/30 transition-colors duration-200">
                  <Icon size={13} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/25">
          <span>© 2026 Unity Shop. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/sitemap", label: "Sitemap" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-white/60 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
