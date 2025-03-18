
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PenTool, 
  LayoutDashboard, 
  LightbulbIcon, 
  BookText, 
  Users, 
  Settings, 
  FileText, 
  Menu,
  X,
  Bot
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AssistantSidebar from './AssistantSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const AppSidebar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  // Set sidebar to collapsed on mobile devices
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Helper function to get user initials
  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className={cn(
      "h-screen border-r border-border transition-all duration-300 flex flex-col bg-background",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            <span className="font-semibold">Content Engine</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <PenTool className="h-5 w-5" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", collapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-3">
          <NavItem 
            to="/dashboard" 
            icon={<LayoutDashboard className="h-4 w-4" />} 
            label="Dashboard" 
            active={pathname === '/dashboard'} 
            collapsed={collapsed}
          />
          
          {/* Assistant Sidebar */}
          <div className={cn(
            "flex items-center gap-2 text-sm py-2 px-3 rounded-md",
            "hover:bg-accent hover:text-accent-foreground transition-colors"
          )}>
            {collapsed ? (
              <div className="mx-auto">
                <Bot className="h-4 w-4" />
              </div>
            ) : (
              <AssistantSidebar />
            )}
          </div>
          
          <NavItem 
            to="/ideas" 
            icon={<LightbulbIcon className="h-4 w-4" />} 
            label="Content Ideas" 
            active={pathname.startsWith('/ideas')} 
            collapsed={collapsed}
          />
          
          <NavItem 
            to="/documents" 
            icon={<BookText className="h-4 w-4" />} 
            label="Documents" 
            active={pathname.startsWith('/documents')} 
            collapsed={collapsed}
          />
          
          <NavItem 
            to="/linkedin" 
            icon={<FileText className="h-4 w-4" />} 
            label="LinkedIn Posts" 
            active={pathname === '/linkedin'} 
            collapsed={collapsed}
          />
          
          <NavItem 
            to="/profile" 
            icon={<Users className="h-4 w-4" />} 
            label="Profile" 
            active={pathname === '/profile'} 
            collapsed={collapsed}
          />
          
          <NavItem 
            to="/settings" 
            icon={<Settings className="h-4 w-4" />} 
            label="Settings" 
            active={pathname === '/settings'} 
            collapsed={collapsed}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && <ThemeToggle />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("h-8 w-8 rounded-full", collapsed && "mx-auto")}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User Avatar" />
                  <AvatarFallback>{getUserInitial()}</AvatarFallback>
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
        
        {!collapsed && (
          <p className="text-xs text-muted-foreground">
            {user?.email ? user.email.split('@')[0] : ''}
            <br />
            {user?.email}
          </p>
        )}
      </div>
    </div>
  );
};

// Helper component for navigation items
const NavItem = ({ to, icon, label, active, collapsed }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 text-sm py-2 px-3 rounded-md",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        active && "bg-accent text-accent-foreground font-medium"
      )}
    >
      {collapsed ? (
        <div className="mx-auto">{icon}</div>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </Link>
  );
};

export default AppSidebar;
