'use client';

import Link from 'next/link';
import { FiTruck, FiGift } from 'react-icons/fi';

/**
 * Props:
 * - subtotal: number
 * - threshold: number (free shipping minimum)
 * - formatPrice: function (from useCurrency)
 * - showSuggestion?: boolean
 */
export default function FreeShippingProgress({
  subtotal = 0,
  threshold = 1000,
  formatPrice,
  showSuggestion = true,
}) {
  const remaining = threshold - subtotal;
  const unlocked = subtotal >= threshold;

  const progress = Math.min((subtotal / threshold) * 100, 100);

  const suggestion =
    showSuggestion && remaining > 0 && remaining < threshold * 0.5
      ? `Only ${formatPrice(remaining)} away from FREE shipping`
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FiTruck
            size={16}
            className={unlocked ? 'text-black' : 'text-gray-500'}
          />

          <span className="text-sm sm:text-base font-bold">
            {unlocked
              ? '🎉 You unlocked FREE shipping!'
              : `Only ${formatPrice(remaining)} away from FREE shipping`}
          </span>
        </div>

        <span className="text-xs text-gray-400 font-medium">
          {formatPrice(threshold)} goal
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            unlocked ? 'bg-black' : 'bg-gray-800'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Smart Suggestion */}
      {suggestion && !unlocked && (
        <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <FiGift size={14} className="text-gray-500 shrink-0" />
          <span className="text-xs text-gray-700 font-medium">
            {suggestion}
          </span>

          <Link
            href="/products"
            className="ml-auto text-xs font-bold text-black hover:underline whitespace-nowrap"
          >
            Shop Now →
          </Link>
        </div>
      )}
    </div>
  );
}
