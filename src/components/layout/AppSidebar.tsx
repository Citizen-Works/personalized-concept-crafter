
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import SidebarLogo from './sidebar/SidebarLogo';
import UserProfileMenu from './sidebar/UserProfileMenu';
import SidebarNav from './sidebar/SidebarNav';

const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b p-4">
        <SidebarLogo />
      </SidebarHeader>
      
      <SidebarContent className="h-full">
        <SidebarNav />
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
