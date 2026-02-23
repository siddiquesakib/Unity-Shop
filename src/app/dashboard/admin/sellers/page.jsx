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
    { key: "pending", label: "Pending", icon: Clock, color: "text-amber-400" },
    {
      key: "approved",
      label: "Approved",
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: XCircle,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCog className="text-indigo-400" size={20} />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Seller Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Seller Requests
          </h1>
          <p className="text-slate-400">
            Review and manage seller account requests from users.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw
            size={18}
            className={`text-slate-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
            }`}
          >
            <tab.icon
              size={16}
              className={filter === tab.key ? tab.color : ""}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <UserCog size={48} className="mb-3 opacity-30" />
            <p className="text-lg font-medium">No {filter} requests</p>
            <p className="text-sm">
              {filter === "pending"
                ? "All seller requests have been reviewed."
                : `No ${filter} requests found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  {filter === "pending" && (
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence>
                  {requests.map((req, index) => (
                    <motion.tr
                      key={req._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {req.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {req.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Joined{" "}
                              {req.createdAt
                                ? new Date(req.createdAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {req.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            req.sellerRequest === "pending"
                              ? "bg-amber-500/10 text-amber-400"
                              : req.sellerRequest === "approved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-rose-500/10 text-rose-400"
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
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(req.email)}
                              disabled={actionLoading === req.email}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} />
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
