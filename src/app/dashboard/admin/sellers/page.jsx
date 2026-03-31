"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  UserCog,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/seller-requests?status=${filter}`,
      );
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching seller requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleApprove = async (email) => {
    setActionLoading(email);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/approve-seller/${email}`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } },
      );
      const data = await res.json();
      if (res.ok) {
        // Remove from list
        setRequests((prev) => prev.filter((r) => r.email !== email));
      } else {
        alert(data.message || "Failed to approve");
      }
    } catch (error) {
      alert("Error approving seller request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (email) => {
    setActionLoading(email);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reject-seller/${email}`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } },
      );
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.email !== email));
      } else {
        alert(data.message || "Failed to reject");
      }
    } catch (error) {
      alert("Error rejecting seller request");
    } finally {
      setActionLoading(null);
    }
  };

  const filterTabs = [
    { key: "pending", label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    {
      key: "approved",
      label: "Approved",
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCog className="text-black" size={20} />
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Seller Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight">
            Seller Requests
          </h1>
          <p className="text-sm font-bold text-gray-400">
            Review and manage seller account requests from users.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2.5 rounded-xl bg-white border-2 border-gray-100 hover:border-black transition-colors group"
        >
          <RefreshCw
            size={18}
            className={`text-gray-400 group-hover:text-black transition-colors ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
              filter === tab.key
                ? "bg-black text-white border-black"
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black"
            }`}
          >
            <tab.icon
              size={16}
              className={filter === tab.key ? "text-white" : ""}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-black animate-spin" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <UserCog size={48} className="mb-3 opacity-30 text-black" />
            <p className="text-sm font-black text-black uppercase tracking-widest">No {filter} requests</p>
            <p className="text-xs font-bold text-gray-400">
              {filter === "pending"
                ? "All seller requests have been reviewed."
                : `No ${filter} requests found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    User
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  {filter === "pending" && (
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-50">
                <AnimatePresence>
                  {requests.map((req, index) => (
                    <motion.tr
                      key={req._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors group/row"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white text-sm font-black shadow-sm">
                            {req.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-black leading-tight">
                              {req.name || "Unknown"}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                              Joined{" "}
                              {req.createdAt
                                ? new Date(req.createdAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">
                        {req.email}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">
                        {req.sellerRequestDate
                          ? new Date(req.sellerRequestDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                            req.sellerRequest === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-100 group-hover/row:bg-amber-500 group-hover/row:text-white group-hover/row:border-amber-500"
                              : req.sellerRequest === "approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover/row:bg-emerald-500 group-hover/row:text-white group-hover/row:border-emerald-500"
                                : "bg-rose-50 text-rose-600 border-rose-100 group-hover/row:bg-rose-500 group-hover/row:text-white group-hover/row:border-rose-500"
                          }`}
                        >
                          {req.sellerRequest === "pending" && (
                            <Clock size={12} />
                          )}
                          {req.sellerRequest === "approved" && (
                            <CheckCircle size={12} />
                          )}
                          {req.sellerRequest === "rejected" && (
                            <XCircle size={12} />
                          )}
                          {req.sellerRequest?.charAt(0).toUpperCase() +
                            req.sellerRequest?.slice(1)}
                        </span>
                      </td>
                      {filter === "pending" && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(req.email)}
                              disabled={actionLoading === req.email}
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleReject(req.email)}
                              disabled={actionLoading === req.email}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
