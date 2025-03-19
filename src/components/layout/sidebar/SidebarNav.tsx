
import React, { memo, useCallback } from "react";
import { NavigationItems } from "./navigation/NavigationItems";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import { SidebarMenu } from "@/components/ui/sidebar/menu";

export const SidebarNav = memo(() => {
  const { isRouteActive } = useSidebarNavigation();
  
  // Create a stable callback that won't change between renders
  const handleIsActive = useCallback((href: string) => {
    return isRouteActive(href);
  }, [isRouteActive]);

  return (
    <aside className="flex flex-col gap-2 py-2">
      <SidebarMenu>
        <NavigationItems isActive={handleIsActive} />
      </SidebarMenu>
    </aside>
  );
});

SidebarNav.displayName = "SidebarNav";
