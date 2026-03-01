"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="bg-black px-8 pt-10 pb-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center ring-4 ring-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Payment Cancelled
              </h1>
              <p className="mt-2 text-gray-400 text-sm">
                No worries — you have not been charged at all.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 text-center">
            <p className="text-gray-400 text-sm leading-relaxed">
              You cancelled the checkout process. Your cart items are still
              saved and ready whenever you want to try again.
            </p>

            {/* Trust badges */}
            <div className="flex justify-center gap-10 mt-6">
              <Badge icon="🔒" label="Secure" />
              <Badge icon="💳" label="No Charge" />
              <Badge icon="↩️" label="Easy Returns" />
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 text-center py-3.5 rounded-full border-2 border-gray-200 hover:border-black text-gray-700 hover:text-black font-bold text-sm transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
