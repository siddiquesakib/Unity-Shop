"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, Package, Clock, CheckCircle } from "lucide-react";

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    if (user?._id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-deliveries/${user._id}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const pending = data.filter(
            (o) => o.status !== "Delivered" && o.status !== "Cancelled",
          ).length;
          const completed = data.filter((o) => o.status === "Delivered").length;
          setStats({
            pending,
            completed,
            total: data.length,
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name || "Delivery Partner"} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Deliveries</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Assigned</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <Truck size={48} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Deliver?
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Check your assigned orders and update their status to keep customers
          informed.
        </p>
        <Link
          href="/dashboard/delivery/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
