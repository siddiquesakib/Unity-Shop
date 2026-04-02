"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

const announcements = [
  "🚚 ৳৫০০+ অর্ডারে ফ্রি ডেলিভারি",
  "📱 bKash / নগদে পেমেন্ট করুন",
  "🔄 ৭ দিনে ইজি রিটার্ন",
  "⚡ সারাদেশে ফাস্ট ডেলিভারি",
  "🛡️ ১০০% অরিজিনাল প্রোডাক্ট গ্যারান্টি",
];

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-black text-white overflow-hidden z-50">
      <div className="flex items-center h-9">
        {/* Scrolling text area */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {/* Double the items for seamless loop */}
            {[...announcements, ...announcements].map((text, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium tracking-wide"
              >
                {text}
                {i < announcements.length * 2 - 1 && (
                  <span className="mx-4 text-white/30">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 px-3 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;
