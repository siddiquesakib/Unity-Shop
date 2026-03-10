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
    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col h-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
      <div className="p-10 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white relative z-10">
        <div>
          <h3 className="text-2xl font-black text-black tracking-tight uppercase">Verification <span className="text-gray-300">Hub</span></h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Security Clearance Protocol</p>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-black/20">
          {applications.length} Pending
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-6 bg-gray-50/30">
          <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-inner">
            <UserX size={40} className="text-gray-200" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Clear Records: No Pending Assets</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 sticky top-0 z-20 backdrop-blur-md">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Entity
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Logs
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">
                  Control
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app, index) => (
                <motion.tr
                  key={app._id || app.email}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="hover:bg-gray-50/50 transition-all group/row"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-black group-hover/row:translate-x-1 transition-transform duration-300">
                        {app.name || "Unknown Identity"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                        {app.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
                      {app.sellerRequestDate
                        ? new Date(app.sellerRequestDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <span className="text-[8px] font-bold text-gray-200 uppercase mt-1 block">Request Registered</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {actionLoading === app.email ? (
                        <div className="px-4">
                          <Loader2
                            className="animate-spin text-black"
                            size={20}
                            strokeWidth={3}
                          />
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(app.email)}
                            className="w-10 h-10 rounded-xl bg-gray-50 text-emerald-600 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-500 shadow-sm"
                            title="Authorize"
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => handleReject(app.email)}
                            className="w-10 h-10 rounded-xl bg-gray-50 text-red-500 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-500 shadow-sm"
                            title="Decline"
                          >
                            <X size={18} strokeWidth={3} />
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
