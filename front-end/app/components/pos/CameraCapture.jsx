'use client';

import { useEffect } from 'react';
import useCamera from '@/app/hooks/useCamera';
import { FiCamera, FiX, FiCheck } from 'react-icons/fi';

export default function CameraCapture({ onCapture, label = "Customer Verification" }) {
  const {
    videoRef,
    isActive,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    resetCapture,
  } = useCamera();

  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive, stopCamera]);

  const handleCapture = () => {
    const imageData = capturePhoto();
    if (imageData && onCapture) {
      onCapture(imageData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiCamera className="w-5 h-5" />
        {label}
      </h3>

      {/* Camera View or Captured Image */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <p className="text-white text-center">Camera not started</p>
              </div>
            )}
            {isActive && (
              <div className="camera-overlay absolute inset-0"></div>
            )}
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive && !capturedImage && (
          <button onClick={startCamera} className="flex-1 btn-primary py-3">
            Start Camera
          </button>
        )}
        
        {isActive && !capturedImage && (
          <>
            <button onClick={handleCapture} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
              <FiCheck className="w-5 h-5" />
              Capture Photo
            </button>
            <button onClick={stopCamera} className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2">
              <FiX className="w-5 h-5" />
              Stop
            </button>
          </>
        )}
        
        {capturedImage && (
          <>
            <button onClick={resetCapture} className="flex-1 btn-outline py-3">
              Retake
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
}