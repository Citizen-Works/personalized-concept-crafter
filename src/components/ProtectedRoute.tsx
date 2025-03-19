
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/ui/loading';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen size="lg" />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
