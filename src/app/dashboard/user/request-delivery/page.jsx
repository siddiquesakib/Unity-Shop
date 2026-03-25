"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function RequestDelivery() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nid: "",
    vehicleType: "Bike",
    preferredArea: "",
    licenseNumber: "",
    experience: "0",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/request-delivery/${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Become a Delivery Hero 🚚
        </h1>
        <p className="text-gray-500 mt-2">
          Join our team and earn by delivering smiles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NID Number
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.nid}
            onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.vehicleType}
            onChange={(e) =>
              setFormData({ ...formData, vehicleType: e.target.value })
            }
          >
            <option value="Bike">Bike (Motorcycle)</option>
            <option value="Cycle">Bicycle</option>
            <option value="Scooter">Scooter</option>
            <option value="Van">Delivery Van</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Driving License (Optional for Cycle)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.licenseNumber}
            onChange={(e) =>
              setFormData({ ...formData, licenseNumber: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Area
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhanmondi, Gulshan"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.preferredArea}
              onChange={(e) =>
                setFormData({ ...formData, preferredArea: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
