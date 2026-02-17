"use client";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
       style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1740&q=80')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Register Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20">
        
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 🛍️
        </h2>

        <form className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="text-white text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white text-sm">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition transform text-white py-2 rounded-lg font-semibold shadow-lg"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-center text-white text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
