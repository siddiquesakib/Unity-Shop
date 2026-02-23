"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or email.");
      return;
    }

    const verifyAndLogin = async () => {
      try {
        // Use NextAuth signIn with the loginToken — it calls our verify-email backend
        const res = await signIn("credentials", {
          email,
          loginToken: token,
          redirect: false,
        });

        if (res?.error) {
          setStatus("error");
          setMessage(
            res.error || "Verification failed. The link may have expired.",
          );
          return;
        }

        setStatus("success");
        setMessage("Email verified! Redirecting to your dashboard...");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try logging in manually.");
      }
    };

    verifyAndLogin();
  }, [searchParams]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1740&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20 text-center">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Verifying Your Email...
            </h2>
            <p className="text-gray-300 text-sm">
              Please wait while we verify your account and log you in.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to UnityShop!
            </h2>
            <p className="text-gray-300 text-sm mb-4">{message}</p>
            <div className="flex items-center justify-center gap-2 text-indigo-300">
              <div className="w-4 h-4 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin"></div>
              <span className="text-sm">Redirecting...</span>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-300 text-sm mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 hover:scale-105 transition transform text-white py-2.5 px-8 rounded-lg font-semibold shadow-lg"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
