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
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>
        {!editing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-colors"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
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
              ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
              : "bg-red-50 border border-red-200 text-red-500"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
      >
        {/* Cover / Avatar Section */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-gray-700 to-gray-900 p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                {profile?.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <User size={40} className="text-gray-300" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name & Role */}
        <div className="pt-16 px-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.name || "User"}
            </h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200 capitalize">
              {profile?.role || "User"}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <User size={20} className="text-gray-500" />
            Personal Information
          </h3>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                />
              ) : (
                <p className="text-gray-900 font-medium">
                  {profile?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900 font-medium">{profile?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
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
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors placeholder-gray-400"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-gray-900 font-medium">
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
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <MapPin size={20} className="text-gray-500" />
            Address & Details
          </h3>

          <div className="space-y-5">
            {/* Address */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
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
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors placeholder-gray-400"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="text-gray-900 font-medium">
                    {profile?.address || "Not set"}
                  </p>
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
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
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors placeholder-gray-400"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Camera size={16} className="text-gray-400" />
                  <p className="text-gray-900 font-medium truncate">
                    {profile?.image || "No image set"}
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1.5 block">
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
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors placeholder-gray-400 resize-none"
                />
              ) : (
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-gray-400 mt-0.5" />
                  <p className="text-gray-900 font-medium">
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
        className="bg-white border border-gray-200 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Shield size={20} className="text-gray-500" />
          Account Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
              Role
            </p>
            <p className="text-gray-900 font-semibold capitalize">
              {profile?.role || "User"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
              Provider
            </p>
            <p className="text-gray-900 font-semibold capitalize">
              {profile?.provider || "Email"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
              Member Since
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <p className="text-gray-900 font-semibold">
                {formatDate(profile?.createdAt)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
              Last Updated
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <p className="text-gray-900 font-semibold">
                {formatDate(profile?.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
