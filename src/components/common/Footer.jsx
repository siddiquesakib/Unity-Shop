// components/common/Footer.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
// this is fotter component
const columns = [
  {
    title: "Navigation",
    links: [
      { href: "/about", label: "Company" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "Docs" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { href: "/products", label: "Introduction" },
      { href: "/categories", label: "Quickstart" },
      { href: "/deals", label: "Why Shop" },
      { href: "/metrics", label: "Metrics" },
      { href: "/use-cases", label: "Use Cases" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-[#b6b6b6] py-12 px-6 lg:px-20 relative overflow-hidden">
      
      {/* --- Watermark Fix: Text-center and Width adjustment --- */}
      <div className="absolute bottom-[-10px] left-0 w-full opacity-[0.03] pointer-events-none select-none overflow-hidden flex justify-center">
         <h1 className="text-[15vw] font-bold text-white whitespace-nowrap leading-none tracking-tighter uppercase">
            UNITY SHOP
         </h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/">
              <Image
                src="/unityshop.png"
                alt="UnityShop"
                width={150}
                height={50}
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm tracking-tight leading-relaxed max-w-[220px]">
              Building a future with premium products.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 bg-[#141414] text-white px-5 py-2 rounded-full text-xs border border-white/5 hover:bg-[#1f1f1f] transition-all"
            >
              <span className="text-[8px] opacity-40">•</span> Sign Up
            </Link>
          </div>

          {/* Links Section */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-white text-[11px] font-medium mb-4 uppercase tracking-[0.15em] opacity-80">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label} className="flex items-center group">
                      <span className="text-[10px] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/40">•</span>
                      <Link 
                        href={link.href} 
                        className="text-sm hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.04]">
          <p className="text-[10px] tracking-widest opacity-40 uppercase">
            © 2026 Copyright Unity Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;