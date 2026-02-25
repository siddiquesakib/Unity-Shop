"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user?.email]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full flex flex-col"
    >
      {/* Header band */}
      <div className="h-20 bg-gray-900 relative" />

      {/* Avatar + Name */}
      <div className="px-6 -mt-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
          ) : profile?.image ? (
            <Image
              src={profile.image}
              alt={profile.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={32} className="text-gray-400" />
          )}
        </div>

        {loading ? (
          <div className="mt-3 space-y-2 w-full flex flex-col items-center">
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <h4 className="mt-3 text-lg font-bold text-gray-900">
              {profile?.name || "User"}
            </h4>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
              <Calendar size={12} />
              <span>Member since {formatDate(profile?.createdAt)}</span>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      {!loading && (
        <div className="px-6 pt-6 pb-5 flex-1 flex flex-col">
          <div className="space-y-1">
            {[
              {
                icon: Mail,
                label: "Email",
                value: profile?.email || "No email",
              },
              {
                icon: Phone,
                label: "Phone",
                value: profile?.phone || "Not set",
              },
              {
                icon: MapPin,
                label: "Address",
                value: profile?.address || "Not set",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <item.icon size={14} className="text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-700 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-5">
            <Link
              href="/dashboard/user/profile"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
            >
              Edit Profile
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
