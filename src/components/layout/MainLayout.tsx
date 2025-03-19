
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        {isMobile && (
          <div className="p-4">
            <SidebarTrigger />
          </div>
        )}
        <div className="container py-4 px-2 sm:py-6 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
