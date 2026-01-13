'use client';

import { FiInfo } from 'react-icons/fi';

export default function QuotaStatus({ quota, className = '' }) {
  if (!quota) return null;

  const used = quota.used || 0;
  const limit = quota.limit || 1;
  const remaining = limit - used;
  const percentage = (used / limit) * 100;

  const getStatusColor = () => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  const statusColor = getStatusColor();
  const colorClasses = {
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-red-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Quota Status</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiInfo className="w-4 h-4" />
          <span>1L per day limit</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quota-progress mb-4">
        <div
          className={`quota-progress-fill ${statusColor} bg-gradient-to-r ${colorClasses[statusColor]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{used.toFixed(2)}L</p>
          <p className="text-sm text-gray-600">Used</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{remaining.toFixed(2)}L</p>
          <p className="text-sm text-gray-600">Remaining</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{limit}L</p>
          <p className="text-sm text-gray-600">Limit</p>
        </div>
      </div>

      {/* Warning Messages */}
      {percentage >= 90 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ You've reached {percentage.toFixed(0)}% of your daily limit!
          </p>
        </div>
      )}
      {percentage >= 70 && percentage < 90 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            ⚡ {percentage.toFixed(0)}% of daily quota used
          </p>
        </div>
      )}
    </div>
  );
}