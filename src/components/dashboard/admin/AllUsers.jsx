"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldCheck,
  Store,
  UserCog,
  User,
  Loader2,
  RefreshCw,
  Mail,
  Calendar,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://unity-shop-server.vercel.app";

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: ShieldCheck,
  },
  manager: {
    label: "Manager",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: UserCog,
  },
  seller: {
    label: "Seller",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Store,
  },
  user: {
    label: "User",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    icon: User,
  },
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { email, name, currentRole, newRole }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    if (!confirmModal) return;
    const { userId, email, newRole } = confirmModal;
    setActionLoading(email);
    setConfirmModal(null);
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.acknowledged || res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)),
        );
      } else {
        alert(data.message || "Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Error changing user role");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    seller: users.filter((u) => u.role === "seller").length,
    user: users.filter((u) => u.role === "user").length,
  };

  const filterTabs = [
    { key: "all", label: "All", icon: Users, color: "text-indigo-400" },
    { key: "admin", label: "Admins", icon: ShieldCheck, color: "text-rose-400" },
    { key: "manager", label: "Managers", icon: UserCog, color: "text-purple-400" },
    { key: "seller", label: "Sellers", icon: Store, color: "text-amber-400" },
    { key: "user", label: "Users", icon: User, color: "text-sky-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="text-indigo-400" size={20} />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              User Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            All Users
          </h1>
          <p className="text-slate-400">
            View and manage all platform users, change roles, and monitor
            accounts.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {filterTabs.map((tab) => {
          const isActive = roleFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                isActive
                  ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <tab.icon size={16} className={tab.color} />
                <span className="text-xs font-medium text-slate-400">
                  {tab.label}
                </span>
              </div>
              <p className="text-xl font-bold text-white">
                {roleCounts[tab.key]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
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
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => {
                    const roleInfo = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                    const RoleIcon = roleInfo.icon;
                    return (
                      <motion.tr
                        key={u._id || u.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        {/* User info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                              {u.image ? (
                                <Image
                                  src={u.image}
                                  alt={u.name || "User"}
                                  width={36}
                                  height={36}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={16} className="text-slate-500" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-white">
                              {u.name || "Unknown"}
                            </p>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-slate-600" />
                            <span className="text-sm text-slate-400">
                              {u.email}
                            </span>
                          </div>
                        </td>

                        {/* Role badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color} border ${roleInfo.border}`}
                          >
                            <RoleIcon size={12} />
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-slate-600" />
                            <span className="text-sm text-slate-400">
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Actions - Role select */}
                        <td className="px-6 py-4 text-right">
                          {actionLoading === u.email ? (
                            <Loader2
                              className="animate-spin text-slate-400 inline-block"
                              size={16}
                            />
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                if (newRole !== u.role) {
                                  setConfirmModal({
                                    userId: u._id,
                                    email: u.email,
                                    name: u.name || u.email,
                                    currentRole: u.role,
                                    newRole,
                                  });
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer appearance-none"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 8px center",
                                paddingRight: "28px",
                              }}
                            >
                              <option value="user">User</option>
                              <option value="seller">Seller</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* Confirm Role Change Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Confirm Role Change
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to change{" "}
                <span className="text-white font-medium">{confirmModal.name}</span>
                &apos;s role from{" "}
                <span className={`font-medium ${ROLE_CONFIG[confirmModal.currentRole]?.color}`}>
                  {ROLE_CONFIG[confirmModal.currentRole]?.label}
                </span>{" "}
                to{" "}
                <span className={`font-medium ${ROLE_CONFIG[confirmModal.newRole]?.color}`}>
                  {ROLE_CONFIG[confirmModal.newRole]?.label}
                </span>
                ?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChange}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-sm text-white font-medium hover:bg-indigo-500 transition-colors"
                >
                  Yes, Change Role
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
