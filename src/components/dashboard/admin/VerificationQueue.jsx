"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, UserX } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

export default function VerificationQueue() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // email of user being processed

  const fetchRequests = () => {
    fetch(`${API_BASE}/users/seller-requests?status=pending`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch seller requests:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (email) => {
    setActionLoading(email);
    try {
      const res = await fetch(`${API_BASE}/users/approve-seller/${email}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.email !== email));
      }
    } catch (err) {
      console.error("Failed to approve:", err);
    }
    setActionLoading(null);
  };

  const handleReject = async (email) => {
    setActionLoading(email);
    try {
      const res = await fetch(`${API_BASE}/users/reject-seller/${email}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.email !== email));
      }
    } catch (err) {
      console.error("Failed to reject:", err);
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-gray-900">Verification Queue</h3>
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          {applications.length} Pending
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
          <UserX size={40} className="text-gray-300" />
          <p className="text-sm">No pending seller requests</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 sticky top-0">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app, index) => (
                <motion.tr
                  key={app._id || app.email}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {app.name || "Unknown"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.sellerRequestDate
                      ? new Date(app.sellerRequestDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoading === app.email ? (
                        <Loader2
                          className="animate-spin text-gray-400"
                          size={16}
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(app.email)}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(app.email)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
