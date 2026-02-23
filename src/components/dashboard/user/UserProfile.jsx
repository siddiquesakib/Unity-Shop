"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Mail, Phone, Edit2 } from "lucide-react";
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
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">My Profile</h3>
        <Link
          href="/dashboard/user/profile"
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {profile?.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
            </div>
            <h4 className="text-xl font-bold text-white">
              {profile?.name || "User"}
            </h4>
            <p className="text-slate-400 text-sm">
              Member since {formatDate(profile?.createdAt)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <Mail size={16} />
              </div>
              <span className="text-sm">{profile?.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <Phone size={16} />
              </div>
              <span className="text-sm">{profile?.phone || "Not set"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <MapPin size={16} />
              </div>
              <span className="text-sm truncate">
                {profile?.address || "Not set"}
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
