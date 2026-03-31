"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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

/* ── Shared styles ────────────────────────────────────────────── */
const INPUT_CLASS =
  "w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all placeholder-gray-400";

const LABEL_CLASS =
  "block text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1.5";

/* ── View-mode row ───────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, value, fallback = "Not set" }) => (
  <div className="flex items-center gap-2.5">
    <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
      <Icon size={13} className="text-gray-400" />
    </span>
    <span className="text-sm text-gray-800 font-medium truncate">{value || fallback}</span>
  </div>
);

/* ── Card primitives ─────────────────────────────────────────── */
const Card = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.22 }}
    className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const CardHead = ({ icon: Icon, title, color = "text-gray-500", bg = "bg-gray-100" }) => (
  <div className="flex items-center gap-3 px-6 py-3.5 border-b border-gray-50 bg-gray-50/70">
    <span className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
      <Icon size={14} className={color} />
    </span>
    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{title}</span>
  </div>
);

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
    bio: "",
  });

  const baseUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, ""),
    [],
  );

  const authHeaders = useMemo(() => {
    const authToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  }, [token]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const email = encodeURIComponent(user.email);
        const res = await fetch(`${baseUrl}/users/profile/${email}`, {
          headers: {
            ...authHeaders,
          },
        });
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
  }, [user?.email, baseUrl, authHeaders]);

  const refetchProfile = async () => {
    try {
      if (!user?.email) return;
      const email = encodeURIComponent(user.email);
      const res = await fetch(`${baseUrl}/users/profile/${email}`, {
        headers: {
          ...authHeaders,
        },
      });
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

  const uploadImageFile = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      headers: {
        ...authHeaders,
      },
      body: fd,
    });

    const data = await res.json().catch(() => null);
    const imageUrl = data?.imageUrl;
    if (!res.ok || !imageUrl) {
      throw new Error(data?.message || data?.error || "Image upload failed");
    }
    return imageUrl;
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);

    try {
      setUploadingImage(true);
      setMessage({ type: "", text: "" });
      const uploadedUrl = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      setMessage({
        type: "success",
        text: "Photo uploaded. Click Save Changes to apply.",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to upload photo",
      });
    } finally {
      setUploadingImage(false);
      // Allow re-selecting the same file again
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const email = encodeURIComponent(user.email);
      const res = await fetch(`${baseUrl}/users/profile/${email}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // Backend may return the updated doc in different shapes; safest is refetch.
        const nextProfile = data?.user?.value || data?.user || null;
        if (nextProfile && typeof nextProfile === "object" && nextProfile.email) {
          setProfile(nextProfile);
        }
        await refetchProfile();
        setEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
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
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl("");
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

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your personal information</p>
        </div>

        {!editing ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-md shadow-gray-900/15"
          >
            <Edit2 size={14} />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <X size={14} />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Save Changes"}
            </motion.button>
          </div>
        )}
      </div>

      {/* ── Toast message ── */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${message.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
          {message.text}
        </motion.div>
      )}

      {/* ── Hero card ── */}
      <Card delay={0}>
        {/* Cover banner */}
        <div className="relative h-32 bg-linear-to-br from-gray-800 via-gray-700 to-gray-900">
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(255,255,255,.15) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(255,255,255,.15) 24px)",
            }}
          />

          {/* Avatar */}
          <div className="absolute -bottom-11 left-7">
            <div className="relative">
              <button
                type="button"
                onClick={editing ? handlePickImage : undefined}
                className={`w-21.5 h-21.5 rounded-2xl ring-4 ring-white shadow-xl bg-white overflow-hidden flex items-center justify-center ${
                  editing ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label={editing ? "Upload profile photo" : "Profile photo"}
              >
                {imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
                    alt={profile?.name || "Profile"}
                    width={86}
                    height={86}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : formData.image || profile?.image ? (
                  <Image
                    src={formData.image || profile.image}
                    alt={profile?.name || "Profile"}
                    width={86}
                    height={86}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User size={36} className="text-gray-400" />
                  </div>
                )}
              </button>

              {editing && (
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-900/20">
                    {uploadingImage ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={14} />
                    )}
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Name & meta */}
        <div className="pt-14 px-7 pb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {profile?.name || "User"}
            </h2>
            <span className="px-2.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {profile?.role || "User"}
            </span>
          </div>
          <p className="text-sm text-gray-400">{profile?.email}</p>
          {profile?.bio && (
            <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-lg border-t border-gray-50 pt-3">
              {profile.bio}
            </p>
          )}
        </div>
      </Card>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Personal Information */}
        <Card delay={0.1}>
          <CardHead icon={User} title="Personal Information" color="text-blue-500" bg="bg-blue-50" />
          <div className="p-6 space-y-5">

            {/* Name */}
            <div>
              <label className={LABEL_CLASS}>Full Name</label>
              {editing ? (
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={INPUT_CLASS} placeholder="Your full name" />
              ) : (
                <InfoRow icon={User} value={profile?.name} />
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className={LABEL_CLASS}>Email Address</label>
              <InfoRow icon={Mail} value={profile?.email} fallback="—" />
            </div>

            {/* Phone */}
            <div>
              <label className={LABEL_CLASS}>Phone Number</label>
              {editing ? (
                <input type="tel" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number" className={INPUT_CLASS} />
              ) : (
                <InfoRow icon={Phone} value={profile?.phone} />
              )}
            </div>

          </div>
        </Card>

        {/* Address & Details */}
        <Card delay={0.15}>
          <CardHead icon={MapPin} title="Address & Details" color="text-orange-400" bg="bg-orange-50" />
          <div className="p-6 space-y-5">

            {/* Address */}
            <div>
              <label className={LABEL_CLASS}>Address</label>
              {editing ? (
                <input type="text" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address" className={INPUT_CLASS} />
              ) : (
                <InfoRow icon={MapPin} value={profile?.address} />
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className={LABEL_CLASS}>Profile Photo</label>
              {editing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      {imagePreviewUrl ? (
                        <Image
                          src={imagePreviewUrl}
                          alt="Preview"
                          width={40}
                          height={40}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={16} className="text-gray-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        Upload a new photo
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        JPG/PNG/WEBP supported
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePickImage}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Camera size={14} />
                      {uploadingImage ? "Uploading…" : "Choose File"}
                    </motion.button>
                  </div>

                  {formData.image ? (
                    <p className="text-[11px] text-gray-400 truncate">
                      {formData.image}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Camera size={13} className="text-gray-400" />
                  </span>
                  <span className="text-sm text-gray-800 font-medium truncate max-w-50">
                    {profile?.image ? "Photo set" : "No photo set"}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className={LABEL_CLASS}>Bio</label>
              {editing ? (
                <textarea value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell something about yourself..."
                  rows={3}
                  className={`${INPUT_CLASS} resize-none leading-relaxed`}
                />
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={13} className="text-gray-400" />
                  </span>
                  <span className="text-sm text-gray-800 font-medium leading-relaxed">
                    {profile?.bio || "No bio added yet"}
                  </span>
                </div>
              )}
            </div>

          </div>
        </Card>
      </div>

      {/* ── Account Info ── */}
      <Card delay={0.2}>
        <CardHead icon={Shield} title="Account Information" color="text-violet-500" bg="bg-violet-50" />
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

            {[
              {
                label: "Role",
                value: profile?.role || "User",
                transform: "capitalize",
              },
              {
                label: "Provider",
                value: profile?.provider || "Email",
                transform: "capitalize",
              },
              {
                label: "Member Since",
                icon: Calendar,
                value: formatDate(profile?.createdAt),
              },
              {
                label: "Last Updated",
                icon: Calendar,
                value: formatDate(profile?.updatedAt),
              },
            ].map(({ label, value, icon: Icon, transform }) => (
              <div key={label}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  {label}
                </p>
                <div className="flex items-center gap-1.5">
                  {Icon && <Icon size={13} className="text-gray-400 shrink-0" />}
                  <p className={`text-sm font-semibold text-gray-800 ${transform || ""}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </Card>

    </div>
  );
}