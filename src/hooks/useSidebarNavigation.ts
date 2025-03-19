
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useSidebarNavigation() {
  const location = useLocation();

  // Memoize the current path parts for more efficient route matching
  const pathData = useMemo(() => {
    const { pathname, search } = location;
    const params = new URLSearchParams(search);
    
    return {
      pathname,
      search,
      params,
      fullPath: pathname + search
    };
  }, [location.pathname, location.search]);
  
  // Optimized route matching that handles special cases more efficiently
  const isRouteActive = useCallback(
    (path: string, exact: boolean = false) => {
      // Handle exact matches
      if (exact) {
        return pathData.fullPath === path;
      }
      
      // Special handling for pipeline routes with query parameters
      if (path.startsWith('/pipeline?tab=')) {
        // Quick path for performance: if not on pipeline page, return false
        if (!pathData.pathname.startsWith('/pipeline')) {
          return false;
        }
        
        const pathTabParam = new URLSearchParams(path.split('?')[1]).get('tab');
        const currentTabParam = pathData.params.get('tab');
        
        return pathTabParam === currentTabParam;
      }
      
      // For pipeline without query params
      if (path === '/pipeline' && pathData.pathname.startsWith('/pipeline')) {
        return true;
      }
      
      // Default path-based matching
      return pathData.pathname.startsWith(path);
    },
    [pathData]
  );

  return {
    isRouteActive,
    currentPath: pathData.fullPath
  };
}
