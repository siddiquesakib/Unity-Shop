"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiDollarSign, FiPackage, FiUser, FiClock } from "react-icons/fi";

export default function SellerNegotiations() {
  const { user, token } = useAuth();
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchNegotiations();
    }
  }, [user]);

  const fetchNegotiations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/negotiations?sellerId=${user._id}&status=pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNegotiations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (negoId, action) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/negotiations/${negoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action }),
        },
      );
      if (!res.ok) throw new Error("Failed to update");
      fetchNegotiations(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
        No pending negotiations.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Pending Negotiations
          </h2>
          <p className="text-sm text-gray-500">
            Review and respond to buyer offers
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {negotiations.length} pending
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {negotiations.map((nego) => (
          <div
            key={nego._id}
            className="p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FiPackage className="text-gray-400" size={16} />
                  <h3 className="font-semibold text-gray-900 truncate">
                    {nego.product?.name || "Product"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiUser size={14} />
                    <span>{nego.buyer?.name || "Buyer"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiDollarSign size={14} />
                    <span>Offer: ${nego.offerPrice}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Original:</span>
                    <span className="line-through">${nego.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{new Date(nego.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {nego.messages?.[0] && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-medium">Message:</span>{" "}
                    {nego.messages[0].message}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(nego._id, "accepted")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(nego._id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
