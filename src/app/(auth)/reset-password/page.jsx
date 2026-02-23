"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true);
    }
  }, [token, email]);

  // Password strength checker
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, text: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (score <= 2) return { level: 2, text: "Fair", color: "bg-yellow-500" };
    if (score <= 3) return { level: 3, text: "Good", color: "bg-blue-500" };
    return { level: 4, text: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid link state
  if (invalidLink) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <FiAlertCircle className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Invalid Reset Link
        </h2>
        <p className="text-white/60 text-sm mb-6">
          This password reset link is invalid or has expired.
          <br />
          Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce">
            <FiCheck className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Password Reset Successful! 🎉
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Your password has been updated successfully.
          <br />
          You can now login with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-2.5 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Reset form
  return (
    <>
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <FiLock className="text-white text-2xl" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Create New Password
      </h2>
      <p className="text-white/60 text-center text-sm mb-6">
        Your new password must be at least 6 characters long.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-center text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="text-white text-sm font-medium">New Password</label>
          <div className="relative mt-1">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength.level ? strength.color : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${
                  strength.level <= 1
                    ? "text-red-400"
                    : strength.level <= 2
                      ? "text-yellow-400"
                      : strength.level <= 3
                        ? "text-blue-400"
                        : "text-green-400"
                }`}
              >
                {strength.text}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-white text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 transition-all ${
                confirmPassword && confirmPassword !== newPassword
                  ? "focus:ring-red-400 ring-1 ring-red-400/50"
                  : confirmPassword && confirmPassword === newPassword
                    ? "focus:ring-green-400 ring-1 ring-green-400/50"
                    : "focus:ring-orange-400"
              }`}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
          )}
          {confirmPassword && confirmPassword === newPassword && (
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <FiCheck className="text-xs" /> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
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
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-white/60 hover:text-orange-300 text-sm transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense
          fallback={
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white/60 text-sm">Loading...</p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
