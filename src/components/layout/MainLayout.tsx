
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out">
        <div className="container py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
