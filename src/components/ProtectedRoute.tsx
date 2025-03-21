
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
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
  const { user, loading, isAdmin, refreshAdminStatus } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(requireAdmin);
  
  // Refresh admin status when requiring admin access
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (requireAdmin && user) {
        await refreshAdminStatus();
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    };
    
    if (requireAdmin && user && !loading) {
      checkAdminStatus();
    } else {
      setIsChecking(false);
    }
  }, [requireAdmin, user, loading, refreshAdminStatus]);
  
  // Show loading state while checking auth or admin status
  if (loading || isChecking) {
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
