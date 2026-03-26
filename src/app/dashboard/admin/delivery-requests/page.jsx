"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function DeliveryRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delivery-requests`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAction = async (email, action) => {
    try {
      const endpoint =
        action === "approve" ? "approve-delivery" : "reject-delivery";
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${endpoint}/${email}`,
        {
          method: "PATCH",
        },
      );
      toast.success(`Request ${action}d successfully`);
      setRequests((prev) => prev.filter((r) => r.email !== email));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Partner Requests</h1>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No pending requests
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((user) => (
            <div
              key={user._id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                <p>
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {user.deliveryRequest.vehicleType}
                </p>
                <p>
                  <span className="font-semibold">Area:</span>{" "}
                  {user.deliveryRequest.preferredArea}
                </p>
                <p>
                  <span className="font-semibold">NID:</span>{" "}
                  {user.deliveryRequest.nid}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {user.deliveryRequest.experience} years
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(user.email, "approve")}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(user.email, "reject")}
                  className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
