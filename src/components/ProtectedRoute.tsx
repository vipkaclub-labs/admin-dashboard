'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Chỉ kiểm tra đã đăng nhập hay chưa
 * Không kiểm tra role - Backend xử lý phân quyền
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Chỉ kiểm tra đã đăng nhập - không kiểm tra role
  if (!isAuthenticated) {
    return null;
  }

  // Đã đăng nhập -> Cho phép truy cập tất cả routes
  return <>{children}</>;
};

export default ProtectedRoute;