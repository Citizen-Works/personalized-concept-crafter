
import React, { Suspense, memo } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import SidebarLogo from './sidebar/SidebarLogo';
import { SidebarNav } from './sidebar/SidebarNav';
import UserProfileMenu from './sidebar/UserProfileMenu';

// Using direct imports instead of lazy loading for critical UI components
// This improves initial load performance for the navigation

const AppSidebar = () => {
  const { isMobile } = useSidebar();
  
  return (
    <Sidebar 
      collapsible="offcanvas"
      side="left"
      variant={isMobile ? "floating" : "sidebar"}
    >
      <SidebarHeader className="border-b p-4">
        <SidebarLogo />
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4 mt-auto">
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default memo(AppSidebar);
