
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
      
      // Special handling for review queue and ideas in pipeline
      if (path === '/pipeline?tab=review') {
        // Only match this exact tab, prevent matching with other tabs
        return pathData.pathname === '/pipeline' && pathData.params.get('tab') === 'review';
      }
      
      if (path === '/pipeline?tab=ideas') {
        // Only match this exact tab
        return pathData.pathname === '/pipeline' && pathData.params.get('tab') === 'ideas';
      }
      
      // For other pipeline tab routes which use query parameters
      if (path.includes('?')) {
        const [basePath, queryString] = path.split('?');
        
        // If not on the base path, return false immediately
        if (!pathData.pathname.startsWith(basePath)) {
          return false;
        }
        
        // Parse the query parameters from the path
        const pathParams = new URLSearchParams(queryString);
        
        // For specific tabs, ensure exact tab parameter matching
        const currentTab = pathData.params.get('tab');
        const requestedTab = pathParams.get('tab');
        
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
      
      // Handle /review-queue standalone page more precisely
      if (path === '/review-queue' && pathData.pathname === '/review-queue') {
        return true;
      }
      
      // Special case for the ideas page
      if (path === '/ideas' && pathData.pathname === '/ideas') {
        return true;
      }
      
      // Handle pipeline with special care
      if (path === '/pipeline' && pathData.pathname === '/pipeline') {
        // If we're on /pipeline with no query params, it's active
        if (pathData.search === '') {
          return true;
        }
        // If there's a tab param, the base /pipeline shouldn't be considered active
        // This helps prevent the glitching issue
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
