
import React from "react";
import { useLocation } from "react-router-dom";
import { NavigationItems } from "./navigation/NavigationItems";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import { SidebarMenu } from "@/components/ui/sidebar/menu";

export const SidebarNav = () => {
  const { isActive } = useSidebarNavigation();

  return (
    <aside className="flex flex-col gap-2 py-2">
      <SidebarMenu>
        <NavigationItems isActive={isActive} />
      </SidebarMenu>
    </aside>
  );
};
