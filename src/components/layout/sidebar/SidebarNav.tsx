import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CircleUser,
  Gauge,
  Settings,
  FileText,
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  Upload,
  Folder,
  FileEdit,
  Music,
  BookMarked,
  Target,
  PenTool,
  SendHorizontal,
  Icons,
  Users,
  Briefcase,
  Facebook,
  Twitter,
  Github,
  Linkedin,
  ThumbsUp,
  Lightbulb,
  Check,
  Pipeline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar/menu";

export const SidebarNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Gauge,
    },
    {
      title: "Content Pipeline",
      href: "/pipeline",
      icon: Pipeline,
      subItems: [
        {
          title: "Review Queue",
          href: "/pipeline?tab=review",
          icon: Lightbulb,
        },
        {
          title: "Ideas",
          href: "/pipeline?tab=ideas",
          icon: FileText,
        },
        {
          title: "Drafts",
          href: "/pipeline?tab=drafts",
          icon: FileEdit,
        },
        {
          title: "Ready to Publish",
          href: "/pipeline?tab=ready",
          icon: Check,
        },
        {
          title: "Published",
          href: "/pipeline?tab=published",
          icon: SendHorizontal,
        },
      ],
    },
    {
      title: "Ideas",
      href: "/ideas",
      icon: Lightbulb,
    },
    {
      title: "Drafts",
      href: "/drafts",
      icon: FileEdit,
    },
    {
      title: "LinkedIn Posts",
      href: "/linkedin-posts",
      icon: Linkedin,
    },
    {
      title: "Transcripts",
      href: "/transcripts",
      icon: Upload,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: Folder,
    },
    {
      title: "Personal Stories",
      href: "/personal-stories",
      icon: BookMarked,
    },
    {
      title: "Content Pillars",
      href: "/content-pillars",
      icon: Icons,
    },
    {
      title: "Target Audiences",
      href: "/target-audiences",
      icon: Target,
    },
    {
      title: "Writing Style",
      href: "/writing-style",
      icon: PenTool,
    },
    {
      title: "Call To Actions",
      href: "/call-to-actions",
      icon: ThumbsUp,
    },
    {
      title: "Marketing Examples",
      href: "/marketing-examples",
      icon: Briefcase,
    },
    {
      title: "Newsletter Examples",
      href: "/newsletter-examples",
      icon: MessagesSquare,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard" && currentPath === "/dashboard") {
      return true;
    }
    
    // Handle pipeline tabs
    if (href.startsWith("/pipeline?tab=")) {
      const tabParam = new URLSearchParams(location.search).get("tab");
      const hrefTab = new URLSearchParams(href.split("?")[1]).get("tab");
      return currentPath === "/pipeline" && tabParam === hrefTab;
    }
    
    if (href === "/pipeline" && currentPath === "/pipeline") {
      return true;
    }
    
    if (href !== "/dashboard" && currentPath.startsWith(href)) {
      return true;
    }
    
    return false;
  };

  return (
    <aside className="flex flex-col gap-2 py-2">
      <SidebarMenu>
        {navigation.map((item, index) => {
          if (item.subItems) {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuSub>
                  <SidebarMenuSubButton 
                    className={cn(
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuSubButton>
                  {item.subItems.map((subItem, subIndex) => (
                    <SidebarMenuSubItem key={subIndex}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          isActive(subItem.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Link to={subItem.href}>
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </aside>
  );
};
