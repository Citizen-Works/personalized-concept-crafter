
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectPath = "/login"
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
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
  
  // For protected routes, redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // For admin-only routes, redirect to dashboard if not an admin
  if (requireAdmin && !isAdmin) {
    console.log('User is not an admin, redirecting from:', location.pathname);
    return <Navigate to="/dashboard" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};
