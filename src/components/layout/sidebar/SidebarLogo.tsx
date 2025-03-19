
import React from 'react';
import { useAuth } from '@/context/AuthContext';

export const SidebarLogo = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Jamie';
  
  return (
    <div className="flex items-center space-x-2">
      <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
      <span className="text-xl font-bold truncate">{userName}'s Content Engine</span>
    </div>
  );
};

export default SidebarLogo;
