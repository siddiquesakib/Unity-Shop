"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1740&q=80')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-orange-900/60"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-[90%] max-w-md border border-white/20">
        {!success ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FiMail className="text-white text-2xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Forgot Password?
            </h2>
            <p className="text-white/60 text-center text-sm mb-6">
              No worries! Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-center text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition-all transform text-white py-2.5 rounded-lg font-semibold shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-orange-300 text-sm transition-colors"
              >
                <FiArrowLeft className="text-xs" />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce">
                <FiCheck className="text-white text-3xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Check Your Email! 📧
            </h2>
            <p className="text-white/60 text-sm mb-2">
              We&apos;ve sent a password reset link to:
            </p>
            <p className="text-orange-300 font-medium mb-6">{email}</p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
              <p className="text-white/50 text-xs mb-2">💡 Tips:</p>
              <ul className="text-white/40 text-xs space-y-1">
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
              className="text-white/60 hover:text-orange-300 text-sm transition-colors underline underline-offset-4"
            >
              Didn&apos;t receive it? Try again
            </button>

            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-orange-300 text-sm transition-colors"
              >
                <FiArrowLeft className="text-xs" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
