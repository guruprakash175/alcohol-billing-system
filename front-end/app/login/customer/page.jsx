'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/app/services/authService';
import { useAuth } from '@/app/hooks/useAuth';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPhone, FiKey } from 'react-icons/fi';

export default function CustomerLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Hooks
  const router = useRouter();
  const { setUserRole } = useAuth();

  // Helper to ensure consistent phone formatting
  const formatPhoneNumber = (phone) => {
    return phone.startsWith('+') ? phone : `+91${phone}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Assuming customerLogin with 1 arg sends the OTP
      const result = await authService.customerLogin(formattedPhone);
      
      setConfirmationResult(result);
      setStep(2);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Send OTP Error:', error);
      // specific check for backend error message or fallback to generic
      const errMsg = error?.response?.data?.message || error.message || 'Failed to send OTP';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // Safety check: If page refreshed, confirmationResult might be lost
    if (!confirmationResult && step === 2) {
        toast.error('Session expired. Please request OTP again.');
        setStep(1);
        return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Verify OTP
      await authService.customerLogin(
        formattedPhone,
        confirmationResult,
        otp
      );

      // ✅ Store role locally for UI routing preference
      localStorage.setItem('userRole', 'customer');

      toast.success('Login successful!');
      
      // ✅ Force reload to ensure AuthContext picks up the new role/token from cookies/storage
      window.location.href = '/customer/order';
      
    } catch (error) {
      console.error('Verification Error:', error);
      
      // Robust error extraction to prevent crashes if message is missing
      const errMsg = error?.response?.data?.message || error.message || 'Invalid OTP';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setStep(1);
    setConfirmationResult(null);
    toast.success('You can request a new OTP now');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-xl mb-4">
              <FiPhone className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Login</h1>
            <p className="text-gray-600">
              {step === 1 
                ? 'Enter your phone number to receive OTP' 
                : 'Enter the 6-digit code sent to your phone'}
            </p>
          </div>

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  We'll send you a one-time password
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength="6"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                    disabled={loading}
                    required
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Sent to +91{phoneNumber}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  disabled={loading}
                >
                  Didn't receive OTP? Resend
                </button>
              </div>
            </form>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> By logging in, you agree to our daily alcohol consumption limit of 1 liter per person.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Protected by Firebase Authentication
        </p>
      </div>
    </div>
  );
}