"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiDollarSign, FiPackage, FiUser, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

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
      
      if (action === "accepted") {
        toast.success("Offer Accepted successfully!");
      } else {
        toast.error("Offer Declined!");
      }

      fetchNegotiations(); // refresh
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading negotiations...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Pending Negotiations</h1>
      {negotiations.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No pending negotiations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {negotiations.map((nego) => (
            <div
              key={nego._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{nego.product.name}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <FiUser size={14} />
                    <span>Buyer: {nego.buyer.name}</span>
                    <span className="mx-1">•</span>
                    <FiDollarSign size={14} />
                    <span>Offer: ${nego.offerPrice}</span>
                    <span className="mx-1">•</span>
                    <span>Original: ${nego.originalPrice}</span>
                  </div>
                  {nego.messages?.[0] && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <span className="font-medium">Message:</span>{" "}
                      {nego.messages[0].message}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(nego._id, "accepted")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(nego._id, "rejected")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
