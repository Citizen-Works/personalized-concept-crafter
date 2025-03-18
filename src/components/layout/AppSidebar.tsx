
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
  Type
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';

export const AppSidebar = () => {
  const { signOut } = useAuth();
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();

  const ideasCount = isIdeasLoading ? null : ideas.length;
  const draftsCount = isDraftsLoading ? null : drafts.length;

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
                <NavLink to="/dashboard" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/ideas" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <Lightbulb className="h-4 w-4" />
                  <span>Ideas</span>
                  {ideasCount !== null && ideasCount > 0 && (
                    <Badge className="ml-auto bg-secondary text-secondary-foreground">{ideasCount}</Badge>
                  )}
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/drafts" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <FileText className="h-4 w-4" />
                  <span>Drafts</span>
                  {draftsCount !== null && draftsCount > 0 && (
                    <Badge className="ml-auto bg-secondary text-secondary-foreground">{draftsCount}</Badge>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Business Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/pillars" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <Target className="h-4 w-4" />
                  <span>Content Pillars</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/audiences" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <Users className="h-4 w-4" />
                  <span>Target Audiences</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/writing-style" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <Type className="h-4 w-4" />
                  <span>Writing Style</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/linkedin" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <LinkedinIcon className="h-4 w-4" />
                  <span>LinkedIn Posts</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/documents" className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
                }>
                  <FileBox className="h-4 w-4" />
                  <span>Documents</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/settings" className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "text-primary font-medium bg-primary/10" : "hover:bg-muted"}`
            }>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
