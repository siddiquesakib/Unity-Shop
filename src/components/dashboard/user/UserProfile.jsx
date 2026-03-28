'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  Calendar,
  Truck,
  Home,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const email = encodeURIComponent(user.email);
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    // Fetch profile + shipping info in parallel — no waterfall delay
    Promise.all([
      fetch(`${baseUrl}/users/profile/${email}`).then(r =>
        r.ok ? r.json() : null,
      ),
      fetch(`${baseUrl}/users/shipping/${email}`).then(r =>
        r.ok ? r.json() : null,
      ),
    ])
      .then(([profileData, shippingData]) => {
        setProfile(profileData);
        if (shippingData && shippingData.fullName) {
          setShippingInfo(shippingData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email]);

  const formatDate = dateStr => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
              {profile?.name || 'User'}
            </h4>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
              <Calendar size={12} />
              <span>Member since {formatDate(profile?.createdAt)}</span>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      {!loading && (
        <div className="px-6 pt-6 pb-5 flex-1 flex flex-col">
          {/* ── Contact info ── */}
          <div className="space-y-1">
            {[
              {
                icon: Mail,
                label: 'Email',
                value: profile?.email || 'No email',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: profile?.phone || 'Not set',
              },
              {
                icon: MapPin,
                label: 'Address',
                value: profile?.address || 'Not set',
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

          {/* ── Saved Shipping Address ── */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                <Truck size={13} className="text-gray-500" /> Saved Shipping
                Address
              </h5>
              <Link
                href="/cart"
                className="text-[10px] text-gray-400 hover:text-black font-semibold transition-colors"
              >
                {shippingInfo ? 'Update' : 'Add'}
              </Link>
            </div>

            {shippingInfo ? (
              <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
                {[
                  { icon: User, label: 'Name', value: shippingInfo.fullName },
                  { icon: Phone, label: 'Phone', value: shippingInfo.phone },
                  { icon: Home, label: 'Address', value: shippingInfo.address },
                  {
                    icon: MapPin,
                    label: 'City',
                    value: shippingInfo.zip
                      ? `${shippingInfo.city} – ${shippingInfo.zip}`
                      : shippingInfo.city,
                  },
                  ...(shippingInfo.note
                    ? [
                        {
                          icon: FileText,
                          label: 'Note',
                          value: shippingInfo.note,
                        },
                      ]
                    : []),
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <row.icon
                      size={12}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium block leading-none mb-0.5">
                        {row.label}
                      </span>
                      <span className="text-[11px] text-gray-700 font-medium leading-snug">
                        {row.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Truck size={20} className="text-gray-300 mx-auto mb-2" />
                <p className="text-[11px] text-gray-500 font-medium">
                  No shipping address saved yet.
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  It saves automatically when you checkout.
                </p>
              </div>
            )}
          </div>

          {/* ── Edit Profile button ── */}
          <div className="mt-auto pt-5">
            <Button
              href="/dashboard/user/profile"
              className="w-full justify-center !py-2.5"
              showIcon={false}
            >
              Edit Profile <ArrowUpRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
