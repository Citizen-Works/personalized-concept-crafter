import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Home, 
  Lightbulb, 
  FileText, 
  Users, 
  Target, 
  LinkedinIcon, 
  FileBox, 
  Settings, 
  LogOut, 
  ChevronsLeft,
  PenTool,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

export const AppSidebar = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-6">
        <div className="flex items-center gap-2">
          <PenTool className="h-6 w-6" />
          <span className="font-semibold text-lg">Content Engine</span>
        </div>
        <SidebarTrigger className="ml-auto">
          <ChevronsLeft className="h-4 w-4" />
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/ideas" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <Lightbulb className="h-4 w-4" />
                    <span>Ideas</span>
                    <Badge className="ml-auto bg-secondary text-secondary-foreground">12</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/drafts" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <FileText className="h-4 w-4" />
                    <span>Drafts</span>
                    <Badge className="ml-auto bg-secondary text-secondary-foreground">5</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Business Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/pillars" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <Target className="h-4 w-4" />
                    <span>Content Pillars</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/audiences" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <Users className="h-4 w-4" />
                    <span>Target Audiences</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/linkedin" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <LinkedinIcon className="h-4 w-4" />
                    <span>LinkedIn Posts</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/documents" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                    <FileBox className="h-4 w-4" />
                    <span>Documents</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full flex items-center text-left">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
