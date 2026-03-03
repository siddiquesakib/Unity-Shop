"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiPackage,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

export default function SellerNegotiationsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchNegotiations();
  }, [user]);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/negotiations/seller`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNegotiations(data.negotiations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (negoId, action) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/negotiations/${negoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      // Update local state without full refetch
      setNegotiations(prev => 
        prev.map(n => n._id === negoId ? { ...n, status: action } : n)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Pending Negotiations
        </h1>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {negotiations.length} pending
        </span>
      </div>

      {negotiations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FiMessageCircle size={40} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            No pending negotiations
          </h2>
          <p className="text-sm text-gray-500">
            When buyers send offers, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {negotiations.map((nego) => (
            <motion.div
              key={nego._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiPackage size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {nego.productDetails?.name || "Product"}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(nego.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FiUser size={14} className="text-gray-400" />
                      <span className="text-gray-600">Buyer:</span>
                      <span className="font-medium text-gray-900">
                        {nego.buyerDetails?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiDollarSign size={14} className="text-gray-400" />
                      <span className="text-gray-600">Offer:</span>
                      <span className="font-medium text-gray-900">
                        ${nego.offerPrice}
                      </span>
                      <span className="text-xs text-gray-400">
                        (List: ${nego.originalPrice})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiClock size={14} className="text-gray-400" />
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          nego.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : nego.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : nego.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {nego.status}
                      </span>
                    </div>
                  </div>

                  {nego.messages?.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Latest message:
                      </p>
                      <p className="text-sm text-gray-800">
                        {nego.messages[0]?.message}
                      </p>
                    </div>
                  )}
                </div>

                {nego.status === "pending" && (
                  <div className="flex gap-2 md:flex-col">
                    <button
                      onClick={() => handleAction(nego._id, "accepted")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(nego._id, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiXCircle size={16} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
