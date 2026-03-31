'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  IdCard,
  Truck,
  Car,
  FileBadge,
  MapPin,
  BriefcaseBusiness,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function DeliveryPartnerPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nidNumber: '',
    vehicleType: 'Bike',
    drivingLicense: '',
    preferredArea: '',
    experience: 0,
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isLicenseRequired = formData.vehicleType !== 'Cycle';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLicenseRequired && !formData.drivingLicense) {
      toast.error('Driving License is required for Bike and Car');
      return;
    }
    if (formData.experience < 0) {
      toast.error('Experience cannot be negative');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Application submitted successfully!');
        setSubmitted(true);
        setTimeout(() => {
          router.push('/dashboard/user');
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted || user?.deliveryRequest?.status === 'pending' || user?.deliveryRequest === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-5 pt-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center border-4 border-green-100 shadow-xl"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900">
          {submitted ? 'Application Submitted!' : 'Application Pending'}
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          {submitted
            ? 'Thank you for applying to become a delivery partner. Our team will review your application and get back to you shortly.'
            : 'Your application to become a delivery partner is currently under review by our team. Please wait for the approval.'}
        </p>
        
        {submitted && (
          <p className="text-emerald-600 text-sm font-semibold animate-pulse mt-2">
            Redirecting to your dashboard...
          </p>
        )}
        {!submitted && (
          <button
            onClick={() => router.push('/dashboard/user')}
            className="mt-6 px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Become a Delivery Hero <span className="inline-block">🚚</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Join our team and earn by delivering smiles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 lg:p-10 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
              <Truck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Partner Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NID Number */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-gray-700">
                NID Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <IdCard
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                />
                <input
                  required
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  placeholder="Enter your National ID"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-gray-700">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Car
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                />
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer"
                >
                  <option value="Bike">Bike</option>
                  <option value="Cycle">Cycle</option>
                  <option value="Car">Car</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Driving License */}
            <AnimatePresence mode="popLayout">
              {isLicenseRequired && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2.5"
                >
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    Driving License <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <FileBadge
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                    />
                    <input
                      required={isLicenseRequired}
                      name="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleChange}
                      placeholder="License number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preferred Area */}
            <div className="space-y-2.5 flex-1">
              <label className="text-sm font-bold text-gray-700">
                Preferred Area
              </label>
              <div className="relative group">
                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                />
                <input
                  required
                  name="preferredArea"
                  value={formData.preferredArea}
                  onChange={handleChange}
                  placeholder="e.g. Dhanmondi, Gulshan"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2.5 mb-2">
              <label className="text-sm font-bold text-gray-700">
                Experience (Years)
              </label>
              <div className="relative group">
                <BriefcaseBusiness
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="number"
                  min="0"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="px-28 py-3 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
