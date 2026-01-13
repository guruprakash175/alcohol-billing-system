'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyApT-mr77l49_sTXowASsZYpF7bpnsIVNo',
  authDomain: 'alcohol-ordering-system.firebaseapp.com',
  databaseURL: 'https://alcohol-ordering-system-default-rtdb.firebaseio.com',
  projectId: 'alcohol-ordering-system',
  storageBucket: 'alcohol-ordering-system.firebasestorage.app',
  messagingSenderId: '596431442440',
  appId: '1:596431442440:web:28c7b118849ae8aa0cf7bd',
  measurementId: 'G-XDT43KX2GQ',
};

// Initialize app ONCE
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ THIS EXPORT WAS MISSING / WRONG BEFORE
export const auth = typeof window !== 'undefined' ? getAuth(app) : null;

// Optional helper (used in auth.js)
export const getFirebaseAuth = () => auth;

export { app };
