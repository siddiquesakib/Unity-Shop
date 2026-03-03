"use client";

import { useEffect, useState } from "react";
import {
    Store,
    Check,
    X,
    ExternalLink,
    Calendar,
    Mail,
    Phone,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    MoreVertical,
    Infomation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSellerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null); // requestId
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller-requests/admin?status=pending`);
            const data = await res.json();
            if (res.ok) {
                setRequests(data);
            } else {
                setError(data.message || "Failed to fetch requests");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status, reason = "") => {
        try {
            setActionLoading(id);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller-requests/admin/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, rejectionReason: reason })
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r._id !== id));
                if (showRejectModal) setShowRejectModal(false);
                setSelectedRequest(null);
                setRejectionReason("");
            } else {
                const data = await res.json();
                alert(data.message || "Operation failed");
            }
        } catch (err) {
            alert("Something went wrong");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Store className="text-indigo-500" />
                        Seller Requests
                    </h1>
                    <p className="text-slate-400 text-sm">Review applications for new store registrations.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20">
                        {requests.length} Pending
                    </div>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <Check size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">All Caught Up!</h3>
                    <p className="text-slate-400">There are no pending seller requests to review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {requests.map((request) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={request._id}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{request.shopName}</h3>
                                            <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                Applied {new Date(request.requestedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRequest(request === selectedRequest ? null : request)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Owner</p>
                                        <p className="text-sm text-slate-200">{request.ownerName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Business Type</p>
                                        <p className="text-sm text-slate-200 capitalize">{request.businessType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Contact</p>
                                        <div className="flex flex-col text-xs text-slate-400">
                                            <span className="flex items-center gap-1"><Mail size={10} /> {request.email}</span>
                                            <span className="flex items-center gap-1"><Phone size={10} /> {request.phone}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Categories</p>
                                        <p className="text-sm text-slate-200 truncate">{request.categories}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/30">
                                    <p className="text-xs text-slate-400 line-clamp-2 italic">&quot;{request.description}&quot;</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 pt-2">
                                <button
                                    disabled={actionLoading === request._id}
                                    onClick={() => handleAction(request._id, "approved")}
                                    className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === request._id ? <Loader2 className="animate-spin" size={16} /> : <Check size={18} />}
                                    Approve
                                </button>
                                <button
                                    disabled={actionLoading === request._id}
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setShowRejectModal(true);
                                    }}
                                    className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <X size={18} />
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            <AnimatePresence>
                {showRejectModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRejectModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Reject Request</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Please provide a reason for rejecting <span className="text-white font-medium">{selectedRequest?.shopName}</span>. This will be sent to the user.
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Incomplete business documents, invalid phone number..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all mb-6 min-h-[120px]"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id, "rejected", rejectionReason)}
                                    disabled={!rejectionReason || actionLoading}
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
