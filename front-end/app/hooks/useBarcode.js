'use client';

import { useState, useEffect, useRef } from 'react';

export const useBarcode = (onScan) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const inputBuffer = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;

    const handleKeyPress = (e) => {
      // Barcode scanners typically send keystrokes very quickly
      // followed by an Enter key
      
      if (e.key === 'Enter') {
        if (inputBuffer.current.length > 0) {
          const code = inputBuffer.current;
          setScannedCode(code);
          
          if (onScan) {
            onScan(code);
          }
          
          inputBuffer.current = '';
        }
      } else if (e.key.length === 1) {
        // Add character to buffer
        inputBuffer.current += e.key;
        
        // Clear buffer after 100ms of inactivity (manual typing detection)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          inputBuffer.current = '';
        }, 100);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isScanning, onScan]);

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    setScannedCode('');
    inputBuffer.current = '';
  };

  const stopScanning = () => {
    setIsScanning(false);
    inputBuffer.current = '';
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const manualInput = (code) => {
    if (code && code.trim()) {
      setScannedCode(code);
      if (onScan) {
        onScan(code);
      }
    }
  };

  const reset = () => {
    setScannedCode('');
    setError(null);
    inputBuffer.current = '';
  };

  return {
    isScanning,
    scannedCode,
    error,
    scannerRef,
    startScanning,
    stopScanning,
    manualInput,
    reset,
  };
};

export default useBarcode;