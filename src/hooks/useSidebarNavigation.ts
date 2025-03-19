
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
      
      // For paths with query parameters like /pipeline?tab=review
      if (path.includes('?')) {
        const [basePath, queryString] = path.split('?');
        
        // If not on the base path, return false immediately (performance optimization)
        if (!pathData.pathname.startsWith(basePath)) {
          return false;
        }
        
        // Parse the query parameters from the path
        const pathParams = new URLSearchParams(queryString);
        
        // Check if the specific tab parameter matches
        // This is important for pipeline tabs like review, ideas, etc.
        for (const [key, value] of pathParams.entries()) {
          const currentValue = pathData.params.get(key);
          if (currentValue !== value) {
            return false;
          }
        }
        
        return true;
      }
      
      // For pipeline without query params
      if (path === '/pipeline' && pathData.pathname === '/pipeline') {
        return true;
      }
      
      // Default path-based matching for regular routes
      return pathData.pathname.startsWith(path);
    },
    [pathData]
  );

  return {
    isRouteActive,
    currentPath: pathData.fullPath
  };
}
