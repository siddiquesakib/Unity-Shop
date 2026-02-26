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
  FiArrowRight,
  FiArrowLeft,
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
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <FiAlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Invalid Reset Link
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          This password reset link is invalid or has expired.
          <br />
          Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-black/20 transition-all duration-200"
        >
          Request New Link
          <FiArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black flex items-center justify-center">
          <FiCheck className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Password Reset Successful!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your password has been updated successfully.
          <br />
          You can now login with your new password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-black/20 transition-all duration-200"
        >
          Go to Login
          <FiArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Reset form
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Create New Password
        </h2>
        <p className="text-gray-500 mt-2">
          Your new password must be at least 6 characters long.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
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
                      i <= strength.level ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${
                  strength.level <= 1
                    ? "text-red-500"
                    : strength.level <= 2
                      ? "text-yellow-500"
                      : strength.level <= 3
                        ? "text-blue-500"
                        : "text-green-500"
                }`}
              >
                {strength.text}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full pl-11 pr-11 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 transition-colors ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : confirmPassword && confirmPassword === newPassword
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-200 focus:border-black focus:ring-black"
              }`}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
          {confirmPassword && confirmPassword === newPassword && (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <FiCheck size={12} /> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-lg shadow-black/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Reset Password
              <FiArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-black font-semibold hover:underline"
        >
          <FiArrowLeft size={14} />
          Back to Login
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
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
            <FiLock className="text-3xl text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">New Password</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
            Create a strong password to keep your account secure and protected.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
              <FiLock className="text-xl text-white" />
            </div>
          </div>

          <Suspense
            fallback={
              <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
