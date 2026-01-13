'use client';

import { useState, useRef } from 'react';
import useBarcode from '@/app/hooks/useBarcode';
import { FiCamera, FiEdit3 } from 'react-icons/fi';

export default function BarcodeScanner({ onScan, label = "Scan Product Barcode" }) {
  const [manualCode, setManualCode] = useState('');
  const { isScanning, scannedCode, startScanning, stopScanning, manualInput, reset } = useBarcode(onScan);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      manualInput(manualCode);
      setManualCode('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiCamera className="w-5 h-5" />
        {label}
      </h3>

      {/* Scanner Status */}
      <div className="mb-6">
        {isScanning ? (
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 relative overflow-hidden">
            <div className="scanner-line"></div>
            <p className="text-blue-800 font-medium text-center relative z-10">
              Scanner Active - Point barcode scanner at product
            </p>
            <p className="text-blue-600 text-sm text-center mt-2">
              Last scanned: {scannedCode || 'None'}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-gray-600 text-center">
              Scanner Inactive
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="flex-1 btn-primary py-3"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700"
          >
            Stop Scanning
          </button>
        )}
        <button
          onClick={reset}
          className="btn-outline"
        >
          Reset
        </button>
      </div>

      {/* Manual Input */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <FiEdit3 className="w-4 h-4" />
          Or Enter Manually
        </h4>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter barcode number"
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}