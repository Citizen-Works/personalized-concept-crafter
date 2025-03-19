
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
      
      // For pipeline tab routes which use query parameters like /pipeline?tab=review
      if (path.includes('?')) {
        const [basePath, queryString] = path.split('?');
        
        // If not on the base path, return false immediately (performance optimization)
        if (!pathData.pathname.startsWith(basePath)) {
          return false;
        }
        
        // Parse the query parameters from the path
        const pathParams = new URLSearchParams(queryString);
        
        // Get the tab parameter value from both the current URL and requested path
        const currentTab = pathData.params.get('tab');
        const requestedTab = pathParams.get('tab');
        
        // Compare the specific tab parameter exactly
        // This is important for differentiating between pipeline tabs
        if (requestedTab && currentTab) {
          return requestedTab === currentTab;
        }
        
        // For other query params, check if they match
        for (const [key, value] of pathParams.entries()) {
          const currentValue = pathData.params.get(key);
          if (currentValue !== value) {
            return false;
          }
        }
        
        return true;
      }
      
      // For pipeline without query params, ensure it's an exact match
      // This prevents /pipeline?tab=X from matching just /pipeline
      if (path === '/pipeline' && pathData.pathname === '/pipeline') {
        // If we're on /pipeline with no query params, it's active
        if (pathData.search === '') {
          return true;
        }
        // If there's a tab param, the base /pipeline shouldn't be considered active
        if (pathData.params.has('tab')) {
          return false;
        }
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
