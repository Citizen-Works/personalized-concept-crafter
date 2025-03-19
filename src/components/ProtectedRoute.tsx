
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAuth = true
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen size="lg" />;
  }
  
  // For authentication pages, we want to redirect authenticated users to dashboard
  // but allow access to non-authenticated users
  if (!requireAuth) {
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
  }
  
  // For protected routes, redirect to waitlist if not authenticated
  if (!user) {
    return <Navigate to="/waitlist" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};
