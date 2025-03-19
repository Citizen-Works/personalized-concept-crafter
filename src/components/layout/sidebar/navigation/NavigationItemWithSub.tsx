
import React, { memo, useMemo } from "react";
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
  // Memoize all computed values to prevent re-renders
  const isParentActive = useMemo(() => isActive(item.href), [isActive, item.href]);
  
  const isAnyChildActive = useMemo(() => 
    item.subItems?.some(subItem => isActive(subItem.href)) || false, 
    [isActive, item.subItems]
  );
  
  const active = isParentActive || isAnyChildActive;
  
  const buttonClassName = useMemo(() => 
    cn(active && "bg-accent text-accent-foreground"),
    [active]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuSub>
        <SidebarMenuSubButton 
          className={buttonClassName}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuSubButton>
        {item.subItems?.map((subItem, subIndex) => {
          // Move isSubActive inside the mapping function to properly react to changes
          const isSubActive = isActive(subItem.href);
          const subButtonClassName = cn(
            isSubActive && "bg-accent text-accent-foreground"
          );
          
          return (
            <SidebarMenuSubItem key={subIndex}>
              <SidebarMenuButton
                asChild
                className={subButtonClassName}
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
