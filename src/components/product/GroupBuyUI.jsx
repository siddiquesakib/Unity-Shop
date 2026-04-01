"use client";

import { useState, useEffect } from "react";
import {
  FiUsers,
  FiClock,
  FiShare2,
  FiCheckCircle,
  FiCopy,
  FiLoader,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupBuyUI({ productId, user, formatPrice }) {
  const [activeGroups, setActiveGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);

  const fetchGroups = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/group-buy/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveGroups(data);
      }
    } catch (err) {
      console.error("Failed to fetch group buys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    const interval = setInterval(fetchGroups, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [productId]);

  const startGroup = async () => {
    if (!user) return alert("Please login to start a group buy");
    setStarting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = `${apiUrl}/group-buy/start`;
      console.log("Attempting to start group buy at:", url);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          creatorId: user._id,
          requiredMembers: 10,
          discountPercentage: 20,
        }),
      });
      if (res.ok) {
        await fetchGroups();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to start group buy");
      }
    } catch (err) {
      console.error("Start Group Error:", err);
      alert("Network error. Please check if the server is running.");
    } finally {
      setStarting(false);
    }
  };

  const joinGroup = async (groupId) => {
    if (!user) return alert("Please login to join this group");
    setJoiningId(groupId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/group-buy/join/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        await fetchGroups();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to join group");
      }
    } catch (err) {
      console.error("Join Group Error:", err);
      alert("Network error");
    } finally {
      setJoiningId(null);
    }
  };

  const leaveGroup = async (groupId) => {
    if (!user) return alert("Please login to leave this group");
    if (!confirm("Are you sure you want to leave/cancel this group buy?"))
      return;

    setLeavingId(groupId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/group-buy/leave/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        await fetchGroups();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to leave group");
      }
    } catch (err) {
      console.error("Leave Group Error:", err);
      alert("Network error");
    } finally {
      setLeavingId(null);
    }
  };

  const copyLink = (groupId) => {
    const link = `${window.location.origin}/products/${productId}?group=${groupId}`;
    navigator.clipboard.writeText(link);
    alert("Group link copied to clipboard!");
  };

  if (loading)
    return <div className="animate-pulse h-20 bg-gray-100 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg relative overflow-hidden group w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-md flex items-center justify-center text-black shadow-sm shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
              <FiUsers size={18} />
            </div>
            <div>
              <p className="font-bold text-black text-[13px] leading-tight">Team Discount</p>
              <p className="text-gray-500 text-[11px] font-medium leading-snug mt-0.5">
                Save 20% with peers
              </p>
            </div>
          </div>
          <button
            onClick={startGroup}
            disabled={starting}
            className="w-full mt-3 sm:mt-0 sm:w-auto px-4 h-9 border-2 border-black bg-black hover:bg-transparent text-white hover:text-black text-[11px] uppercase tracking-wide font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            {starting ? <FiLoader className="animate-spin" /> : <FiPlus size={14} />}
            New Group
          </button>
        </div>

      <AnimatePresence>
        {activeGroups.map((group) => {
          const timeLeft = Math.max(0, new Date(group.expiryTime) - new Date());
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
          );
          const progress = (group.members.length / group.requiredMembers) * 100;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={group._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    >
                      {i === 0 ? "👑" : <FiUser size={12} />}
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold">
                  <FiClock />
                  {hours}h {minutes}m left
                </div>
              </div>

              <div className="flex justify-between items-end mb-1">
                <p className="text-xs text-gray-500 font-medium">
                  {group.members.length}/{group.requiredMembers} joined
                </p>
                <p className="text-xs font-bold text-gray-600">
                  {group.requiredMembers - group.members.length} more needed
                </p>
              </div>

              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-black"
                />
              </div>

              <div className="flex gap-2">
                {group.members.includes(user?._id) ? (
                  <button
                    onClick={() => leaveGroup(group._id)}
                    disabled={leavingId === group._id}
                    className="flex-1 py-2 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold rounded-lg hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    {leavingId === group._id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiX size={14} />
                    )}
                    {group.creatorId === user?._id
                      ? "Cancel Group"
                      : "Leave Group"}
                  </button>
                ) : (
                  <button
                    onClick={() => joinGroup(group._id)}
                    disabled={joiningId === group._id}
                    className="flex-1 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {joiningId === group._id ? (
                      <FiLoader className="animate-spin mx-auto" />
                    ) : (
                      "Join Team"
                    )}
                  </button>
                )}
                <button
                  onClick={() => copyLink(group._id)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100 rounded-lg transition-all"
                >
                  <FiShare2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function FiUser({ size }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function FiPlus({ size }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function FiX({ size }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

