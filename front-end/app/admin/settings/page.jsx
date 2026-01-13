'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    dailyQuotaLimit: 1,
    taxRate: 5,
    storeName: 'Alcohol Control POS',
    storeAddress: '123 Main Street, City',
    receiptFooter: 'Thank you for your purchase!',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system parameters</p>
      </div>

      <div className="space-y-6">
        {/* Quota Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quota Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Quota Limit (Liters)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.dailyQuotaLimit}
                onChange={(e) => setSettings({ ...settings, dailyQuotaLimit: e.target.value })}
                className="input-field max-w-xs"
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Billing Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                className="input-field max-w-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Footer</label>
              <textarea
                value={settings.receiptFooter}
                onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                rows={3}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 py-3">
            <FiSave className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}