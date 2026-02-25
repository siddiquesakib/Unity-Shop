"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiArrowLeft, FiCheck, FiArrowRight } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            <FiMail className="text-3xl text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Reset Password</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
            Don&apos;t worry, it happens to the best of us. We&apos;ll help you
            get back into your account.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
              <FiMail className="text-xl text-white" />
            </div>
          </div>

          {!success ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 mt-2">
                  No worries! Enter your email and we&apos;ll send you a reset
                  link.
                </p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-lg shadow-black/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-black font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black flex items-center justify-center">
                <FiCheck className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                We&apos;ve sent a password reset link to:
              </p>
              <p className="text-black font-semibold text-lg mb-6">{email}</p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 max-w-xs mx-auto text-left">
                <p className="text-gray-500 text-xs mb-2 font-medium">
                  💡 Tips:
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>
                    • Check your spam folder if you don&apos;t see the email
                  </li>
                  <li>• The link expires in 1 hour</li>
                  <li>• Only the latest link will work</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-gray-500 hover:text-black text-sm transition-colors underline underline-offset-4"
              >
                Didn&apos;t receive it? Try again
              </button>

              <div className="mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
                >
                  <FiArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
