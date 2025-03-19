
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
  // Memoize whether the parent item is active
  const isParentActive = useMemo(() => 
    isActive(item.href), 
    [isActive, item.href]
  );
  
  // Memoize whether any child item is active
  const isAnyChildActive = useMemo(() => 
    item.subItems?.some(subItem => isActive(subItem.href)) || false, 
    [isActive, item.subItems]
  );
  
  // Parent is active if either it or any of its children are active
  const active = isParentActive || isAnyChildActive;
  
  // Memoize the class name
  const buttonClassName = useMemo(() => 
    cn(active && "bg-accent text-accent-foreground"),
    [active]
  );

  // Pre-compute active states for all subitems at once
  const subItemActiveStates = useMemo(() => 
    item.subItems?.map(subItem => ({
      item: subItem,
      isActive: isActive(subItem.href)
    })) || [],
    [isActive, item.subItems]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuSub>
        <SidebarMenuSubButton 
          className={buttonClassName}
          isActive={active} // Pass active state directly
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuSubButton>
        
        {subItemActiveStates.map(({ item: subItem, isActive: isSubActive }, subIndex) => {
          const subButtonClassName = cn(
            isSubActive && "bg-accent text-accent-foreground"
          );
          
          return (
            <SidebarMenuSubItem key={`${subItem.title}-${subIndex}`}>
              <SidebarMenuButton
                asChild
                className={subButtonClassName}
                isActive={isSubActive} // Pass active state directly
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
