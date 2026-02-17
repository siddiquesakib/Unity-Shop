"use client";
import Link from "next/link";

const page = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1470&q=80')",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Login Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20">

                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Welcome Back 👋
                </h2>

                <form className="space-y-4">

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
                            placeholder="Enter your password"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Login Button */}
                    <Link
                        href="/login"
                        className="bg-white text-orange-500 px-4 py-1 rounded-full font-medium hover:bg-orange-50 transition cursor-pointer"
                    >
                        Login
                    </Link>

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
};

export default page;
