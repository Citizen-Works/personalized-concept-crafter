
import React, { memo, useMemo } from "react";
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

export const NavigationItem: React.FC<NavigationItemProps> = memo(({ 
  item, 
  isActive 
}) => {
  // Memoize the active state to prevent unnecessary re-renders
  const active = useMemo(() => isActive(item.href), [isActive, item.href]);
  
  // Memoize the className computation
  const buttonClassName = useMemo(() => 
    cn(active && "bg-accent text-accent-foreground"),
    [active]
  );
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={buttonClassName}
      >
        <Link to={item.href}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

NavigationItem.displayName = "NavigationItem";
