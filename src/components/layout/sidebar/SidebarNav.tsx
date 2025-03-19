
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
  ChevronRight, ListTodo, CheckCircle, Upload,
  Plus, MessageSquare, Users, Link as LinkIcon,
  Layout, Target, Type
} from 'lucide-react';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

const SidebarNav = () => {
  const { isRouteActive, currentPath } = useSidebarNavigation();
  
  // Define main navigation items with updated structure
  const navigationItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home,
      isActive: isRouteActive("/dashboard", true)
    },
    {
      label: "Content Pipeline",
      icon: Layout,
      isActive: isRouteActive("/review-queue") || 
               isRouteActive("/ideas") || 
               isRouteActive("/drafts") ||
               isRouteActive("/ready-to-publish") ||
               isRouteActive("/published"),
      subItems: [
        {
          to: "/review-queue",
          label: "Review Queue",
          isActive: isRouteActive("/review-queue")
        },
        {
          to: "/ideas",
          label: "Ideas",
          isActive: isRouteActive("/ideas")
        },
        {
          to: "/drafts",
          label: "Drafts",
          isActive: isRouteActive("/drafts")
        },
        {
          to: "/ready-to-publish",
          label: "Ready to Publish",
          isActive: isRouteActive("/ready-to-publish")
        },
        {
          to: "/published",
          label: "Published",
          isActive: isRouteActive("/published")
        }
      ]
    },
    {
      label: "Create",
      icon: Plus,
      isActive: isRouteActive("/new-content-idea") || 
               isRouteActive("/generate-draft"),
      subItems: [
        {
          to: "/new-content-idea",
          label: "New Content Idea",
          isActive: isRouteActive("/new-content-idea")
        },
        {
          to: "/generate-draft",
          label: "Generate Draft",
          isActive: isRouteActive("/generate-draft")
        }
      ]
    },
    {
      label: "Content Library",
      icon: FileText,
      isActive: isRouteActive("/linkedin-posts") || 
               isRouteActive("/transcripts") ||
               isRouteActive("/documents") ||
               isRouteActive("/personal-stories"),
      subItems: [
        {
          to: "/linkedin-posts",
          label: "LinkedIn Posts",
          isActive: isRouteActive("/linkedin-posts")
        },
        {
          to: "/transcripts",
          label: "Meeting Transcripts",
          isActive: isRouteActive("/transcripts")
        },
        {
          to: "/documents",
          label: "Documents",
          isActive: isRouteActive("/documents", true)
        },
        {
          to: "/personal-stories",
          label: "Personal Stories",
          isActive: isRouteActive("/personal-stories")
        }
      ]
    },
    {
      label: "Strategy",
      icon: BookText,
      isActive: isRouteActive("/content-pillars") || 
               isRouteActive("/target-audiences") || 
               isRouteActive("/writing-style") ||
               isRouteActive("/call-to-actions"),
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
        },
        {
          to: "/call-to-actions",
          label: "Call-to-Actions",
          isActive: isRouteActive("/call-to-actions")
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
