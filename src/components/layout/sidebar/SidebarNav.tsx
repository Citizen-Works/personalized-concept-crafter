
import React, { memo, useMemo } from "react";
import { NavigationItems } from "./navigation/NavigationItems";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import { SidebarMenu } from "@/components/ui/sidebar/menu";

export const SidebarNav = memo(() => {
  const { isRouteActive } = useSidebarNavigation();
  
  // Memoize the isActive function to ensure consistent reference
  const memoizedIsActive = useMemo(() => isRouteActive, [isRouteActive]);

  return (
    <aside className="flex flex-col gap-2 py-2">
      <SidebarMenu>
        <NavigationItems isActive={memoizedIsActive} />
      </SidebarMenu>
    </aside>
  );
});

SidebarNav.displayName = "SidebarNav";
