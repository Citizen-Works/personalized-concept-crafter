
import React, { memo } from "react";
import { NavigationItems } from "./navigation/NavigationItems";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import { SidebarMenu } from "@/components/ui/sidebar/menu";

export const SidebarNav = memo(() => {
  const { isRouteActive } = useSidebarNavigation();

  return (
    <aside className="flex flex-col gap-2 py-2">
      <SidebarMenu>
        <NavigationItems isActive={isRouteActive} />
      </SidebarMenu>
    </aside>
  );
});

SidebarNav.displayName = "SidebarNav";
