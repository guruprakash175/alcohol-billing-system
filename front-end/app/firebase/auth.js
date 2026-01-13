'use client';

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebaseClient';

// ==============================
// Email / Password Login
// ==============================
export const loginWithEmail = async (email, password) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Authentication service not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // 🔑 Force refresh for custom claims (staff / admin)
    const idToken = await userCredential.user.getIdToken(true);

    // 🛡 Optional role check (uncomment if needed)
    /*
    const tokenResult = await userCredential.user.getIdTokenResult();
    if (tokenResult.claims.role !== 'staff') {
      await firebaseSignOut(auth);
      throw new Error('Unauthorized access');
    }
    */

    return {
      user: userCredential.user,
      idToken,
    };
  } catch (error) {
    let message = 'Login failed';

    switch (error.code) {
      case 'auth/invalid-credential':
        message = 'Invalid email or password';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Try again later';
        break;
      default:
        message = error.message || 'Authentication error';
    }

    throw new Error(message);
  }
};

// ==============================
// Phone OTP Login
// ==============================
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return;

  const auth = getFirebaseAuth();
  if (!auth || window.recaptchaVerifier) return;

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: 'invisible',
    }
  );
};

export const sendOTP = async (phoneNumber) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Authentication service not initialized');
  }

  setupRecaptcha();
  return await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
};

export const verifyOTP = async (confirmationResult, otp) => {
  const userCredential = await confirmationResult.confirm(otp);
  const idToken = await userCredential.user.getIdToken(true);

  return {
    user: userCredential.user,
    idToken,
  };
};

// ==============================
// Logout
// ==============================
export const signOut = async () => {
  const auth = getFirebaseAuth();
  if (auth) {
    await firebaseSignOut(auth);
  }
};

// ==============================
// Token Helper
// ==============================
export const getCurrentUserToken = async () => {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) return null;

  return await user.getIdToken(true);
};
