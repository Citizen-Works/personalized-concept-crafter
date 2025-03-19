
import React, { lazy, Suspense } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

// Lazy load components
const SidebarLogo = lazy(() => import('./sidebar/SidebarLogo'));
const UserProfileMenu = lazy(() => import('./sidebar/UserProfileMenu'));
const SidebarNav = lazy(() => import('./sidebar/SidebarNav'));

const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b p-4">
        <Suspense fallback={<div className="h-6 w-full animate-pulse bg-gray-200 rounded"></div>}>
          <SidebarLogo />
        </Suspense>
      </SidebarHeader>
      
      <SidebarContent className="h-full">
        <Suspense fallback={<div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-full animate-pulse bg-gray-200 rounded"></div>
          ))}
        </div>}>
          <SidebarNav />
        </Suspense>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-200 rounded"></div>}>
          <UserProfileMenu />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
