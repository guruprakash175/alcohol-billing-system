'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated
        router.push('/');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Not authorized for this role
        router.push('/');
      }
    }
  }, [user, userRole, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
}