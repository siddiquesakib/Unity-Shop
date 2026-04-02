"use client";

import Link from "next/link";
import { FiShoppingBag, FiArrowLeft, FiPackage, FiSearch } from "react-icons/fi";

export default function ProductNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfbf7] px-4 py-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-gray-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

      <div className="max-w-3xl w-full text-center space-y-10 z-10 relative">
        
        {/* Animated Icon Area */}
        <div className="relative w-32 h-32 mx-auto group">
          <div className="absolute inset-0 bg-gray-300 rounded-[2rem] rotate-12 scale-110 opacity-20 mt-2 transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-100"></div>
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 z-10">
            <FiPackage className="text-gray-800" size={54} strokeWidth={1} />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)] border-[3px] border-white flex items-center justify-center animate-bounce z-20">
              <FiSearch className="text-white" size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-5">
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight drop-shadow-sm">
            Product Gone!
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            This item is out of stock, unavailable, or the link is broken.
            <br className="hidden md:block mt-3" /> 
            <span className="mt-4 font-bold text-gray-800 bg-white px-4 py-1.5 rounded-xl border border-gray-200 inline-block shadow-sm">Let&apos;s find you something better.</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/products"
            className="group flex flex-1 sm:flex-auto items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-800 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 active:scale-95"
          >
            <FiShoppingBag size={22} className="group-hover:animate-bounce" />
            Explore Collection
          </Link>
          <Link
            href="/"
            className="group flex flex-1 sm:flex-auto items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-white text-black border-2 border-gray-200 rounded-2xl font-black text-lg shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 hover:border-black transition-all duration-300 active:scale-95"
          >
            <FiArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}