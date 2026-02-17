"use client";
import { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-linear-to-r from-orange-300 via-orange-400 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ===== Logo Section ===== */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* SVG Logo */}
          <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition duration-300">
            <Image
              src="https://res.cloudinary.com/djss04any/image/upload/v1771322540/logo_yifd93.jpg"
              alt="Unity-Shop Logo"
              className="object-cover h-8 w-8"
              width={32}
              height={32}
            />
          </div>

          {/* Brand Name */}
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
          <Link href="/shop" className="hover:text-gray-200 transition">
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
        <div className="flex items-center gap-5">
          {/* Cart */}
          <div className="bg-white text-orange-500 cursor-pointer p-2 rounded-full shadow-md group-hover:scale-110 transition duration-300">
            <FaShoppingCart size={20} />
          </div>
          {/* User */}
          <Link
            href="/login"
            className="bg-white text-orange-500 px-8 py-1 rounded-full font-medium "
          >
            Login
          </Link>

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
        <div className="md:hidden bg-white text-gray-800 px-6 pb-4 space-y-3">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/shop" className="block">
            Shop
          </Link>
          <Link href="/about" className="block">
            About
          </Link>
          <Link href="/contact" className="block">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
