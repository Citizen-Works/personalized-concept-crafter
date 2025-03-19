
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { 
  Home, FileText, PenSquare, Lightbulb, 
  Linkedin, BookText, FileImage, Settings,
  ChevronRight
} from 'lucide-react';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

const SidebarNav = () => {
  const { isRouteActive, currentPath } = useSidebarNavigation();
  
  // Define main navigation items with clearer structure
  const navigationItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home,
      isActive: isRouteActive("/dashboard", true)
    },
    {
      to: "/ideas",
      label: "Content Ideas",
      icon: Lightbulb,
      isActive: isRouteActive("/ideas")
    },
    {
      to: "/drafts",
      label: "Content Drafts",
      icon: PenSquare,
      isActive: isRouteActive("/drafts")
    },
    {
      label: "Documents",
      icon: FileText,
      isActive: isRouteActive("/documents") || isRouteActive("/transcripts"),
      subItems: [
        {
          to: "/documents",
          label: "All Documents",
          isActive: isRouteActive("/documents", true)
        },
        {
          to: "/transcripts",
          label: "Meeting Transcripts",
          isActive: isRouteActive("/transcripts")
        }
      ]
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      isActive: isRouteActive("/linkedin-posts"),
      subItems: [
        {
          to: "/linkedin-posts",
          label: "Posts",
          isActive: isRouteActive("/linkedin-posts")
        }
      ]
    },
    {
      label: "Resources",
      icon: BookText,
      isActive: isRouteActive("/content-pillars") || 
               isRouteActive("/target-audiences") || 
               isRouteActive("/writing-style"),
      subItems: [
        {
          to: "/content-pillars",
          label: "Content Pillars",
          isActive: isRouteActive("/content-pillars")
        },
        {
          to: "/target-audiences",
          label: "Target Audiences",
          isActive: isRouteActive("/target-audiences")
        },
        {
          to: "/writing-style",
          label: "Writing Style",
          isActive: isRouteActive("/writing-style")
        }
      ]
    },
    {
      label: "Examples",
      icon: FileImage,
      isActive: isRouteActive("/marketing-examples") || isRouteActive("/newsletter-examples"),
      subItems: [
        {
          to: "/marketing-examples",
          label: "Marketing",
          isActive: isRouteActive("/marketing-examples")
        },
        {
          to: "/newsletter-examples",
          label: "Newsletter",
          isActive: isRouteActive("/newsletter-examples")
        }
      ]
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
      isActive: isRouteActive("/settings")
    }
  ];

  const renderSubMenu = (subItems, isActive) => (
    <SidebarMenuSub>
      {subItems.map((item, index) => (
        <SidebarMenuSubItem key={index}>
          <SidebarMenuSubButton isActive={item.isActive}>
            <Link to={item.to}>{item.label}</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );

  return (
    <SidebarMenu>
      {navigationItems.map((item, index) => (
        <SidebarMenuItem key={index}>
          {item.subItems ? (
            <>
              <SidebarMenuButton isActive={item.isActive}>
                <item.icon className="mr-2" />
                <span>{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </SidebarMenuButton>
              {renderSubMenu(item.subItems, item.isActive)}
            </>
          ) : (
            <SidebarMenuButton isActive={item.isActive}>
              <Link to={item.to} className="flex items-center w-full">
                <item.icon className="mr-2" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default memo(SidebarNav);
