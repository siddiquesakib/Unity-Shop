"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Shield,
  Calendar,
  Camera,
  FileText,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
    bio: "",
  });

  // Fetch profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`,
        );
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
            image: data.image || "",
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) {
      loadProfile();
    }
  }, [user?.email]);

  const refetchProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`,
      );
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          image: data.image || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setProfile(data.user);
        setEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      image: profile?.image || "",
      bio: profile?.bio || "",
    });
    setEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your personal information
          </p>
        </div>
        {!editing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            <Edit2 size={16} />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              <X size={16} />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        )}
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
      >
        {/* Cover / Avatar Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden">
                {profile?.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name & Role */}
        <div className="pt-16 px-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">
              {profile?.name || "User"}
            </h2>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20 capitalize">
              {profile?.role || "User"}
            </span>
          </div>
          <p className="text-slate-400 text-sm">{profile?.email}</p>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <User size={20} className="text-indigo-400" />
            Personal Information
          </h3>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              ) : (
                <p className="text-white font-medium">
                  {profile?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-500" />
                <p className="text-white font-medium">{profile?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-500" />
                  <p className="text-white font-medium">
                    {profile?.phone || "Not set"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Address & More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <MapPin size={20} className="text-indigo-400" />
            Address & Details
          </h3>

          <div className="space-y-5">
            {/* Address */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Address
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter your address"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-500" />
                  <p className="text-white font-medium">
                    {profile?.address || "Not set"}
                  </p>
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Profile Image URL
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Camera size={16} className="text-slate-500" />
                  <p className="text-white font-medium truncate">
                    {profile?.image || "No image set"}
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Bio
              </label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell something about yourself..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-500 resize-none"
                />
              ) : (
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-slate-500 mt-0.5" />
                  <p className="text-white font-medium">
                    {profile?.bio || "No bio added yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" />
          Account Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
              Role
            </p>
            <p className="text-white font-semibold capitalize">
              {profile?.role || "User"}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
              Provider
            </p>
            <p className="text-white font-semibold capitalize">
              {profile?.provider || "Email"}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
              Member Since
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-500" />
              <p className="text-white font-semibold">
                {formatDate(profile?.createdAt)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
              Last Updated
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-500" />
              <p className="text-white font-semibold">
                {formatDate(profile?.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
