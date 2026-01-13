'use client';

import { useState } from 'react';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState('week');

  const salesData = [
    { date: 'Jan 1', sales: 12000, volume: 150 },
    { date: 'Jan 2', sales: 19000, volume: 200 },
    { date: 'Jan 3', sales: 15000, volume: 180 },
    { date: 'Jan 4', sales: 22000, volume: 220 },
    { date: 'Jan 5', sales: 28000, volume: 280 },
    { date: 'Jan 6', sales: 35000, volume: 350 },
    { date: 'Jan 7', sales: 30000, volume: 300 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Sales and consumption analytics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FiDownload className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <FiCalendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Volume Sold (Liters)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">₹161,000</p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last period</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Volume</p>
          <p className="text-3xl font-bold text-gray-900">1,680L</p>
          <p className="text-sm text-green-600 mt-2">+8.2% from last period</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Avg Per Customer</p>
          <p className="text-3xl font-bold text-gray-900">0.85L</p>
          <p className="text-sm text-blue-600 mt-2">Within quota limits</p>
        </div>
      </div>
    </div>
  );
}