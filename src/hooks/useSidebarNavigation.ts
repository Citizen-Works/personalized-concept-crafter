
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useSidebarNavigation() {
  const { pathname } = useLocation();

  // Memoize the current path to prevent unnecessary re-renders
  const currentPath = useMemo(() => pathname, [pathname]);
  
  // Check if a path is active based on the current pathname
  const isRouteActive = useCallback(
    (path: string, exact: boolean = false) => {
      if (exact) {
        return currentPath === path;
      }
      
      // Special handling for pipeline routes with query parameters
      if (path.startsWith('/pipeline?tab=')) {
        const tabParam = new URLSearchParams(path.split('?')[1]).get('tab');
        const currentTabParam = new URLSearchParams(currentPath.split('?')[1])?.get('tab');
        return currentPath.startsWith('/pipeline') && tabParam === currentTabParam;
      }
      
      // For pipeline without query params
      if (path === '/pipeline' && currentPath.startsWith('/pipeline')) {
        return true;
      }
      
      return currentPath.startsWith(path);
    },
    [currentPath]
  );

  return {
    isRouteActive,
    currentPath
  };
}
