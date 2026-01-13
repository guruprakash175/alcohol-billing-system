'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { userAPI } from '@/app/services/api';
import QuotaStatus from '@/app/components/QuotaStatus';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiCalendar } from 'react-icons/fi';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileData, quotaData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getQuota(),
      ]);
      setProfile(profileData.data.user);
      setQuota(quotaData.data.quota);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and quota</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{profile?.name || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium text-gray-900">{user?.phoneNumber || profile?.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <button className="mt-6 btn-outline w-full">
            Edit Profile
          </button>
        </div>

        {/* Quota Status */}
        <div>
          <QuotaStatus quota={quota} />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Daily Limit Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Maximum 1 liter per person per day</li>
              <li>• Quota resets at midnight</li>
              <li>• Purchases tracked across all stores</li>
              <li>• Valid ID required for verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}