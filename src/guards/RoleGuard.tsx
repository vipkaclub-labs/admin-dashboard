'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: never; // Deprecated - no longer needed
  fallbackPath?: string;
}

/**
 * RoleGuard - Protect routes/components based on authentication
 * Since this is an admin-only portal, we only check authentication
 * @param fallbackPath - Path to redirect if not authenticated (default: /login)
 */
const RoleGuard = ({ children, fallbackPath = '/login' }: RoleGuardProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(fallbackPath);
    }
  }, [isAuthenticated, router, fallbackPath]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
