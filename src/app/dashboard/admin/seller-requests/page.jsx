"use client";

import { useEffect, useState } from "react";
import {
    Store,
    Check,
    X,
    Calendar,
    Mail,
    Phone,
    Loader2,
    MoreVertical
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
                <Loader2 className="animate-spin text-black" size={40} strokeWidth={3} />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white border border-gray-100 shadow-sm">
                            <Store className="text-black" size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                            Admin Review Queue
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight leading-[0.9]">
                        Seller <span className="text-gray-200">Requests</span>
                    </h1>
                    <p className="text-base text-gray-500 font-medium max-w-2xl">
                        Review applications for new store registrations.
                    </p>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] self-start">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-30"></div>
                    </div>
                    <span className="text-xs font-black text-black uppercase tracking-widest">
                        {requests.length} Pending
                    </span>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    <div className="text-center py-20 text-gray-400 text-sm font-bold border-2 border-dashed border-gray-100 rounded-[2.5rem] uppercase tracking-widest">
                        All caught up — no pending seller requests.
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {requests.map((request) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={request._id}
                            className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden relative group/card hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between"
                        >
                            <div className="space-y-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-black group-hover/card:bg-black group-hover/card:text-white group-hover/card:border-black transition-all duration-500 shadow-sm">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-black tracking-tight leading-tight">
                                                {request.shopName}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2 mt-2">
                                                <Calendar size={14} className="text-gray-300" />
                                                Applied {new Date(request.requestedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedRequest(request === selectedRequest ? null : request)}
                                        className="p-2.5 rounded-xl bg-white border border-gray-100 hover:border-black/20 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black"
                                        aria-label="More options"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Owner</p>
                                        <p className="text-sm font-bold text-black">{request.ownerName}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Business Type</p>
                                        <p className="text-sm font-bold text-black capitalize">{request.businessType}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Contact</p>
                                        <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-2"><Mail size={12} className="text-gray-400" /> {request.email}</span>
                                            <span className="flex items-center gap-2"><Phone size={12} className="text-gray-400" /> {request.phone}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Categories</p>
                                        <p className="text-sm font-bold text-black truncate">{request.categories}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                                    <p className="text-sm text-gray-600 italic line-clamp-2">&quot;{request.description}&quot;</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    disabled={actionLoading === request._id}
                                    onClick={() => handleAction(request._id, "approved")}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRejectModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                        >
                            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Reject Request</h3>
                            <p className="text-gray-500 text-sm font-medium mb-6">
                                Please provide a reason for rejecting <span className="text-black font-black">{selectedRequest?.shopName}</span>. This will be sent to the user.
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Incomplete business documents, invalid phone number..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm outline-none focus:bg-white focus:border-black/30 focus:ring-2 focus:ring-black/10 transition-all mb-6 min-h-30"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-3 bg-white border border-gray-200 hover:border-black/30 hover:bg-gray-50 text-black rounded-2xl text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id, "rejected", rejectionReason)}
                                    disabled={!rejectionReason || actionLoading}
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
