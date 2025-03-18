import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useProSidebar,
} from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, LayoutDashboard, LightbulbIcon, BookText, Users, Settings, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AssistantSidebar from './AssistantSidebar';

const AppSidebar = () => {
  const { collapseSidebar, toggled, broken, collapsed } = useProSidebar();
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <Sidebar
      width="240px"
      collapsedWidth="64px"
      backgroundColor="hsl(var(--background))"
      borderColor="hsl(var(--border))"
      className="border-r border-muted"
    >
      <SidebarRail>
        <div className="relative flex flex-col items-center h-full">
          <Link to="/">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary text-secondary-foreground shrink-0">
              <PenTool className="h-6 w-6" />
            </div>
          </Link>
          <div className="flex flex-col gap-2 w-full mt-4">
            <SidebarMenuButton href="/dashboard" active={pathname === '/dashboard'}>
              <LayoutDashboard className="h-4 w-4" />
            </SidebarMenuButton>
            <SidebarMenuButton href="/ideas" active={pathname.startsWith('/ideas')}>
              <LightbulbIcon className="h-4 w-4" />
            </SidebarMenuButton>
            <SidebarMenuButton href="/documents" active={pathname.startsWith('/documents')}>
              <BookText className="h-4 w-4" />
            </SidebarMenuButton>
            <SidebarMenuButton href="/linkedin-posts" active={pathname === '/linkedin-posts'}>
              <FileText className="h-4 w-4" />
            </SidebarMenuButton>
            <SidebarMenuButton href="/profile" active={pathname === '/profile'}>
              <Users className="h-4 w-4" />
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarRail>
      
      <SidebarContent className="p-0">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2 font-semibold text-lg">
            <PenTool className="h-6 w-6" />
            <span>Content Engine</span>
          </div>
        </SidebarHeader>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard" active={pathname === '/dashboard'}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Add the Assistant Sidebar menu item */}
          <SidebarMenuItem>
            <AssistantSidebar />
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton href="/ideas" active={pathname.startsWith('/ideas')}>
              <LightbulbIcon className="h-4 w-4" />
              <span>Content Ideas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton href="/documents" active={pathname.startsWith('/documents')}>
              <BookText className="h-4 w-4" />
              <span>Documents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton href="/linkedin-posts" active={pathname === '/linkedin-posts'}>
              <FileText className="h-4 w-4" />
              <span>LinkedIn Posts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton href="/profile" active={pathname === '/profile'}>
              <Users className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton href="/settings" active={pathname === '/settings'}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarFooter className="p-4">
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Avatar"} />
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground">
            {user?.displayName}
            <br />
            {user?.email}
          </p>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
