"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const res = await register(name, email, password);
    if (res.success) {
      router.push("/login");
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    await googleLogin();
    setIsLoading(false);
  };

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

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-5"
        >
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/60 text-sm">or register with email</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="text-white text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

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
              placeholder="Create password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition transform text-white py-2 rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Register"}
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
