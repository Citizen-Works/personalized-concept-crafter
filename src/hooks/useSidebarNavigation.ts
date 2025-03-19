
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useSidebarNavigation() {
  const { pathname } = useLocation();

  // Check if a path is active based on the current pathname
  const isRouteActive = useCallback(
    (path: string, exact: boolean = false) => {
      if (exact) {
        return pathname === path;
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  return {
    isRouteActive,
    currentPath: pathname
  };
}
