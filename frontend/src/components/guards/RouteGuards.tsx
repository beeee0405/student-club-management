import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export function AdminRoute({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  // Immediate guard: if no token in storage, kick to /auth without waiting for queries
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If token is missing, user is definitely not authenticated
  if (!hasToken) {
    return <Navigate to="/auth" replace />;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function PublicRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // Nếu đã đăng nhập, chuyển đến trang phù hợp
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" />;
    }
    // Người dùng thường quay về trang chủ
    return <Navigate to="/" />;
  }

  return children;
}

export function UserRoute({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" />;
  }

  return children;
}