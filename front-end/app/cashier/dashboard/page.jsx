'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/app/services/api';
import { FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

export default function CashierDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Today Sales', value: stats?.todaySales || 0, prefix: '₹', icon: FiDollarSign, color: 'green' },
    { label: 'Transactions', value: stats?.todayTransactions || 0, icon: FiShoppingCart, color: 'blue' },
    { label: 'Customers Served', value: stats?.todayCustomers || 0, icon: FiUsers, color: 'purple' },
    { label: 'Avg Transaction', value: stats?.avgTransaction || 0, prefix: '₹', icon: FiTrendingUp, color: 'amber' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashier Dashboard</h1>
        <p className="text-gray-600">Point of Sale System - Today's Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'from-green-500 to-green-600',
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            amber: 'from-amber-500 to-amber-600',
          };
          
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.prefix}{typeof stat.value === 'number' ? stat.value.toFixed(0) : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/cashier/billing">
          <div className="card-hover bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 cursor-pointer">
            <FiDollarSign className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Billing</h2>
            <p className="text-amber-100">Process new customer transaction</p>
          </div>
        </Link>

        <Link href="/cashier/verify">
          <div className="card-hover bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 cursor-pointer">
            <FiUsers className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verify Customer</h2>
            <p className="text-blue-100">Check customer ID and quota</p>
          </div>
        </Link>
      </div>
    </div>
  );
}