// components/product/SupplierCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiStar,
  FiCheckCircle,
  FiMessageSquare,
  FiUsers,
  FiPackage,
} from "react-icons/fi";

const SupplierCard = ({ supplier, expanded = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${expanded ? "" : "sticky top-24"}`}
    >
      <div className="p-6">
        {/* Header with logo */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
            {supplier.logo ? (
              <Image
                src={supplier.logo}
                alt={supplier.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                {supplier.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center text-yellow-400">
                <FiStar className="fill-current" />
                <span className="ml-1 text-sm text-gray-700">
                  {supplier.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({supplier.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Response Rate</div>
            <div className="font-semibold text-green-600">
              {supplier.responseRate}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Response Time</div>
            <div className="font-semibold">{supplier.responseTime}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Products</div>
            <div className="font-semibold">{supplier.productsCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500">Followers</div>
            <div className="font-semibold">
              {(supplier.followers / 1000).toFixed(1)}k
            </div>
          </div>
        </div>

        {/* Info items */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center text-gray-600">
            <span className="w-20">Location:</span>
            <span className="font-medium">{supplier.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="w-20">Years:</span>
            <span className="font-medium">
              {supplier.yearsInBusiness} years
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {supplier.tradeAssurance && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              <FiCheckCircle className="mr-1" /> Trade Assurance
            </span>
          )}
          {supplier.verified && (
            <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
              <FiCheckCircle className="mr-1" /> Verified
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!expanded && (
          <div className="space-y-2">
            <button className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center space-x-2">
              <FiMessageSquare />
              <span>Chat Now</span>
            </button>
            <Link
              href={`/suppliers/${supplier.id}`}
              className="w-full py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:border-orange-300 transition flex items-center justify-center space-x-2"
            >
              <FiUsers />
              <span>Visit Store</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierCard;
