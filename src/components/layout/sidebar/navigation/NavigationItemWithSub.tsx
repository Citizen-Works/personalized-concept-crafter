
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar/menu";
import { NavItem } from "./types";

interface NavigationItemWithSubProps {
  item: NavItem;
  isActive: (href: string) => boolean;
}

export const NavigationItemWithSub: React.FC<NavigationItemWithSubProps> = memo(({ 
  item, 
  isActive 
}) => {
  // Determine if parent route or any child route is active
  const isParentActive = isActive(item.href);
  const isAnyChildActive = item.subItems?.some(subItem => isActive(subItem.href)) || false;
  const active = isParentActive || isAnyChildActive;

  return (
    <SidebarMenuItem>
      <SidebarMenuSub>
        <SidebarMenuSubButton 
          className={cn(
            active && "bg-accent text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuSubButton>
        {item.subItems?.map((subItem, subIndex) => {
          const isSubActive = isActive(subItem.href);
          
          return (
            <SidebarMenuSubItem key={subIndex}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isSubActive && "bg-accent text-accent-foreground"
                )}
              >
                <Link to={subItem.href}>
                  <subItem.icon className="h-4 w-4" />
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          );
        })}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
});

NavigationItemWithSub.displayName = "NavigationItemWithSub";
