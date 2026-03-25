"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import Button from "@/components/common/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const res = await login(email, password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    await googleLogin();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-center justify-center">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/10 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white/15 rounded-full" />

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 mx-auto mb-8 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-black text-black">U</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
            Sign in to access your account, track orders, and discover amazing deals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-xs mt-1">Products</p>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">50K+</p>
              <p className="text-xs mt-1">Customers</p>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">99%</p>
              <p className="text-xs mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
              <span className="text-xl font-black text-white">U</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex cursor-pointer items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex cursor-pointer items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-black font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
