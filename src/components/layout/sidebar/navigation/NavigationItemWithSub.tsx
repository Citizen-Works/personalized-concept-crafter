
import React from "react";
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

export const NavigationItemWithSub: React.FC<NavigationItemWithSubProps> = ({ 
  item, 
  isActive 
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuSub>
        <SidebarMenuSubButton 
          className={cn(
            isActive(item.href) && "bg-accent text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuSubButton>
        {item.subItems?.map((subItem, subIndex) => (
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
};
