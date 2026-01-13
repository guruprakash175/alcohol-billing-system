'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase/firebaseClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken(true);
          const tokenResult = await firebaseUser.getIdTokenResult();

          const role =
            tokenResult.claims.role ||
            localStorage.getItem('userRole') ||
            null;

          setUser(firebaseUser);
          setIdToken(token);
          setUserRole(role);

          localStorage.setItem('userRole', role ?? '');
          localStorage.setItem('userId', firebaseUser.uid);
        } else {
          setUser(null);
          setUserRole(null);
          setIdToken(null);
          localStorage.clear();
        }
      } catch (err) {
        console.error('Auth state error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth) return;
    await auth.signOut();
    localStorage.clear();
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, userRole, setUserRole, idToken, loading, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
