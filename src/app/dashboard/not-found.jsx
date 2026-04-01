"use client";

import Link from "next/link";
import { FiGrid, FiPackage, FiLifeBuoy, FiAlertOctagon } from "react-icons/fi";

export default function DashboardNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 rounded-2xl border border-gray-200 border-dashed my-8 mx-4">
      <div className="max-w-lg w-full text-center space-y-6">
        
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center rotate-3 border border-gray-200 shadow-sm">
            <FiAlertOctagon className="text-gray-400" size={32} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Area Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            The dashboard page you are trying to access doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group"
          >
            <FiGrid className="text-gray-400 group-hover:text-black transition-colors" size={24} />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Dashboard</span>
          </Link>

          <Link
            href="/dashboard/user/orders"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group"
          >
            <FiPackage className="text-gray-400 group-hover:text-black transition-colors" size={24} />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">My Orders</span>
          </Link>

          <Link
            href="/contact"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all group"
          >
            <FiLifeBuoy className="text-gray-400 group-hover:text-black transition-colors" size={24} />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Help Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}