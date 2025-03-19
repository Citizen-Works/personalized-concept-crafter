
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Define our navigation item types
export interface SubNavigationItem {
  to: string;
  label: string;
}

export interface NavigationItem {
  to: string;
  label: string;
  icon?: any;
  subItems?: SubNavigationItem[];
}

export function useSidebarNavigation() {
  const { pathname } = useLocation();

  // Check if a path is active based on the current pathname
  const isRouteActive = useCallback(
    (path: string, exact: boolean = false) => {
      if (exact) {
        return pathname === path;
      }
      return pathname.includes(path);
    },
    [pathname]
  );

  // Check if any sub-items are active
  const hasActiveChild = useCallback(
    (items: SubNavigationItem[]) => {
      return items?.some(item => isRouteActive(item.to, true));
    },
    [isRouteActive]
  );

  // Process navigation items to include isActive status
  const processNavigationItems = useCallback(
    <T extends NavigationItem>(items: T[]): (T & { isActive: boolean })[] => {
      return items.map(item => ({
        ...item,
        isActive: item.subItems 
          ? hasActiveChild(item.subItems)
          : isRouteActive(item.to, false)
      }));
    },
    [isRouteActive, hasActiveChild]
  );

  return {
    isRouteActive,
    hasActiveChild,
    processNavigationItems,
    currentPath: pathname
  };
}
