
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar/menu";
import { NavItem } from "./types";

interface NavigationItemProps {
  item: NavItem;
  isActive: (href: string) => boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ 
  item, 
  isActive 
}) => {
  return (
    <SidebarMenuItem>
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
};
