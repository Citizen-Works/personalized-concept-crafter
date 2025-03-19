
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, FileText, PenSquare, Lightbulb, Settings, 
  LogOut, ChevronDown, Users, Palette, Linkedin, 
  BookText, FileImage, Mail 
} from 'lucide-react';
import { toast } from 'sonner';

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sidebar defaultCollapsed={isMobile} collapsible="true">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <span className="text-xl font-bold">ContentCraft</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="h-full">
        <SidebarMenu>
          <SidebarMenuItem 
            icon={<Home />} 
            active={pathname === '/dashboard'}
          >
            <Link to="/dashboard">Dashboard</Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem 
            icon={<Lightbulb />} 
            active={pathname.includes('/ideas')}
          >
            <Link to="/ideas">Content Ideas</Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem 
            icon={<PenSquare />} 
            active={pathname.includes('/drafts')}
          >
            <Link to="/drafts">Content Drafts</Link>
          </SidebarMenuItem>
          
          <SidebarMenuSub 
            icon={<FileText />}
            title="Documents"
            defaultOpen={pathname.includes('/documents') || pathname.includes('/transcripts')}
          >
            <SidebarMenuSubItem 
              active={pathname === '/documents'}
            >
              <Link to="/documents">All Documents</Link>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem 
              active={pathname === '/transcripts'}
            >
              <Link to="/transcripts">Meeting Transcripts</Link>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
          
          <SidebarMenuSub 
            icon={<Linkedin />}
            title="LinkedIn"
            defaultOpen={pathname.includes('/linkedin')}
          >
            <SidebarMenuSubItem 
              active={pathname === '/linkedin-posts'}
            >
              <Link to="/linkedin-posts">Posts</Link>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
          
          <SidebarMenuSub 
            icon={<BookText />}
            title="Resources"
            defaultOpen={pathname.includes('/content-pillars') || pathname.includes('/target-audiences') || pathname.includes('/writing-style')}
          >
            <SidebarMenuSubItem 
              active={pathname === '/content-pillars'}
            >
              <Link to="/content-pillars">Content Pillars</Link>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem 
              active={pathname === '/target-audiences'}
            >
              <Link to="/target-audiences">Target Audiences</Link>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem 
              active={pathname === '/writing-style'}
            >
              <Link to="/writing-style">Writing Style</Link>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
          
          <SidebarMenuSub 
            icon={<FileImage />}
            title="Examples"
            defaultOpen={pathname.includes('/marketing-examples') || pathname.includes('/newsletter-examples')}
          >
            <SidebarMenuSubItem 
              active={pathname === '/marketing-examples'}
            >
              <Link to="/marketing-examples">Marketing</Link>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem 
              active={pathname === '/newsletter-examples'}
            >
              <Link to="/newsletter-examples">Newsletter</Link>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
          
          <SidebarMenuItem 
            icon={<Settings />} 
            active={pathname.includes('/settings')}
          >
            <Link to="/settings">Settings</Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.user_metadata?.name ? getInitials(user.user_metadata.name) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user?.user_metadata?.name || user?.email}</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
