'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Store,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  CreditCard,
  LayoutGrid,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/common/Button';

export default function BecomeSellerPage() {
  const { user, submitSellerRequest } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: user?.name || '',
    email: user?.email || '',
    phone: '',
    businessType: 'individual',
    address: '',
    bankInfo: '',
    categories: '',
    description: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await submitSellerRequest(formData);

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 3000);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  if (submitted || user?.sellerRequest === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 pt-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center border-4 border-green-100"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">
          {submitted ? 'Application Submitted!' : 'Application Pending'}
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          {submitted
            ? 'Thank you for applying to become a seller on UnityShop. Our team will review your application and get back to you shortly.'
            : 'Your application to become a seller is currently under review by our team. Please wait for the approval.'}
        </p>
        {submitted && (
          <p className="text-emerald-600 text-sm font-semibold animate-pulse">
            Redirecting you to dashboard...
          </p>
        )}
        {!submitted && (
          <Button onClick={() => router.push('/dashboard/user')} className="mt-4">
            Go to Dashboard
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Become a Seller
        </h1>
        <p className="text-gray-500">
          Join our community and start reaching thousands of customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-900 flex items-center justify-center">
              <Store size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Shop Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Shop Name
              </label>
              <div className="relative group">
                <Store
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"
                />
                <input
                  required
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Enter your shop name"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Business Type
              </label>
              <div className="relative group">
                <Briefcase
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"
                />
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900  outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none"
                >
                  <option value="individual" className="bg-gray-100">
                    Individual
                  </option>
                  <option value="company" className="bg-gray-100">
                    Company
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Shop Description
            </label>
            <div className="relative group">
              <FileText
                size={18}
                className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors"
              />
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us a bit about what you plan to sell..."
                rows={4}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900  outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Owner Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Full Name
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors"
                />
                <input
                  required
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Owner's full name"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900  outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors"
                />
                <input
                  readOnly
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-500   outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <div className="relative group">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors"
                />
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Product Categories
              </label>
              <div className="relative group">
                <LayoutGrid
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors"
                />
                <input
                  required
                  name="categories"
                  value={formData.categories}
                  onChange={handleChange}
                  placeholder="e.g. Electronics, Fashion, Home"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Business Address
            </label>
            <div className="relative group">
              <MapPin
                size={18}
                className="absolute left-3 top-3 text-slate-500 group-focus-within:text-purple-500 transition-colors"
              />
              <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full physical business address"
                rows={2}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 space-y-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Information
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Bank or Mobile Banking Details
            </label>
            <div className="relative group">
              <CreditCard
                size={18}
                className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
              />
              <textarea
                required
                name="bankInfo"
                value={formData.bankInfo}
                onChange={handleChange}
                placeholder="Bank Name, Account Number, Branch or Mobile Banking details..."
                rows={3}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl text-rose-500 text-sm">
            {error}
          </div>
        )}

        <Button className="w-full font-bold py-4 rounded-2xl flex items-center justify-center">
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Submit Application</>
          )}
        </Button>
      </form>
    </div>
  );
}
