'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { FiUser, FiUserCheck, FiShield } from 'react-icons/fi';

export default function HomePage() {
  const { user, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userRole) {
      // Redirect based on role
      if (userRole === 'customer') {
        router.push('/customer/order');
      } else if (userRole === 'cashier') {
        router.push('/cashier/dashboard');
      } else if (userRole === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, userRole, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiShield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Alcohol Control
            <span className="block text-3xl md:text-4xl text-blue-400 mt-2">POS System</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Smart consumption monitoring and regulated daily purchase limits for responsible alcohol sales
          </p>
        </div>

        {/* Login Options */}
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 mb-8">
          {/* Customer Login Card */}
          <Link href="/login/customer">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Customer Login</h2>
                <p className="text-gray-300 mb-6">
                  Browse products, place orders, and track your daily alcohol consumption quota
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Login with Phone OTP</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Staff Login Card */}
          <Link href="/login/staff">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiUserCheck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Staff Login</h2>
                <p className="text-gray-300 mb-6">
                  Access POS billing system, verify customers, and manage transactions (Cashier & Admin)
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Login with Email</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-1">Secure Authentication</h3>
            <p className="text-gray-400 text-sm">Firebase-powered OTP & role-based access</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-white font-semibold mb-1">Daily Quota Tracking</h3>
            <p className="text-gray-400 text-sm">1L per person per day enforcement</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="text-white font-semibold mb-1">Real-time POS</h3>
            <p className="text-gray-400 text-sm">Instant verification & billing</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2025 Alcohol Control POS System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}