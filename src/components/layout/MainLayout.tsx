
import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/SidebarContext';
import { SidebarRail } from '@/components/ui/sidebar/SidebarRail';

// Lazy load AppSidebar
const AppSidebar = lazy(() => import('./AppSidebar'));

export const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex w-full h-screen overflow-hidden bg-background">
        {/* Force Suspense to render immediately for desktop */}
        <Suspense fallback={<div className="w-0 md:w-64 bg-sidebar animate-pulse"></div>}>
          <AppSidebar />
        </Suspense>
        
        {/* Add SidebarRail for desktop resizing */}
        <SidebarRail className="hidden md:flex" />
        
        <main className="flex-1 h-screen overflow-y-auto relative">
          {isMobile && (
            <div className="p-4 sticky top-0 z-30 bg-background/95 backdrop-blur-sm shadow-sm">
              <SidebarTrigger />
            </div>
          )}
          <div className="container py-4 px-2 sm:py-6 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
