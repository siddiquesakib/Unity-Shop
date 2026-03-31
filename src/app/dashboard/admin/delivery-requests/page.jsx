'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Truck, MapPin, IdCard, Users, CheckCircle, XCircle } from 'lucide-react';

export default function DeliveryRequestsAdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-requests/admin?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        toast.error('Failed to load requests');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (id, action) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) throw new Error('Missing auth token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery-requests/admin/${id}`,
        {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ status: action })
        }
      );

      if (res.ok) {
        toast.success(`Request ${action} successfully`);
        // Remove from list if filter is pending, else update status locally
        if (filter === 'pending') {
          setRequests((prev) => prev.filter((r) => r._id !== id));
        } else {
          setRequests((prev) => 
            prev.map(r => r._id === id ? { ...r, status: action } : r)
          );
        }
      } else {
        const data = await res.json();
        toast.error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Delivery Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Manage delivery partner applications</p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
          {['pending', 'approved', 'rejected', 'all'].map(statusOption => (
            <button
              key={statusOption}
              onClick={() => setFilter(statusOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === statusOption 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Truck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
          <p className="text-gray-500 text-sm mt-1">There are no {filter !== 'all' ? filter : ''} delivery partner requests.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black font-bold text-lg">
                    {req.name?.charAt(0).toUpperCase() || <Users size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{req.name}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{req.email}</p>
                  </div>
                </div>
                {req.status === 'pending' && (
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full capitalize">
                    {req.status}
                  </span>
                )}
                {req.status === 'approved' && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">
                    {req.status}
                  </span>
                )}
                {req.status === 'rejected' && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full capitalize">
                    {req.status}
                  </span>
                )}
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl flex-1">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">Vehicle:</span> {req.vehicleType}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">Area:</span> {req.preferredArea}
                </div>
                <div className="flex items-center gap-2">
                  <IdCard size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">NID:</span> {req.nidNumber}
                </div>
                {req.drivingLicense && (
                  <div className="flex items-center gap-2">
                    <IdCard size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-900">License:</span> {req.drivingLicense}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">Experience:</span> {req.experience} {req.experience === 1 ? 'year' : 'years'}
                </div>
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleAction(req._id, 'approve')}
                    className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'rejected')}
                    className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
