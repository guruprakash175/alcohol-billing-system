'use client';

import { useState } from 'react';
import CameraCapture from '@/app/components/pos/CameraCapture';
import { billingService } from '@/app/services/billingService';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function CashierVerifyPage() {
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!customerId) {
      toast.error('Please enter customer ID');
      return;
    }

    setLoading(true);
    try {
      const [customer, quota] = await Promise.all([
        billingService.verifyCustomer(customerId),
        billingService.checkQuota(customerId),
      ]);
      
      setCustomerData({ ...customer.customer, quota: quota.quota });
      toast.success('Customer verified successfully');
    } catch (error) {
      toast.error(error.message);
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = (imageData) => {
    console.log('Captured photo:', imageData);
    toast.success('Photo captured for verification');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Verification</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: ID Input */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Enter Customer ID</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Customer ID or Phone Number"
                className="flex-1 input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              />
              <button onClick={handleVerify} className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Customer Info */}
          {customerData && (
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${customerData.quota?.remaining > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {customerData.quota?.remaining > 0 ? (
                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <FiXCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  {customerData.quota?.remaining > 0 ? 'Verified' : 'Quota Exceeded'}
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{customerData.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{customerData.phoneNumber}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Used</p>
                    <p className="font-semibold text-red-600">{customerData.quota?.used || 0}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="font-semibold text-green-600">{customerData.quota?.remaining || 0}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Limit</p>
                    <p className="font-semibold">{customerData.quota?.limit || 1}L</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Camera */}
        <div>
          <CameraCapture onCapture={handlePhotoCapture} label="Face Verification (Optional)" />
        </div>
      </div>
    </div>
  );
}