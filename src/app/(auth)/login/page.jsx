"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success) {
      router.push("/dashboard"); 
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1740&q=80')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-orange-900/60">
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-[90%] max-w-md border border-white/20">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition transform text-white py-2 rounded-lg font-semibold shadow-lg"
          >
            Login
          </button>

          {/* Register Link */}
          <p className="text-center text-white text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-300 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
