
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
      
      // Extract base path and query string from the provided path
      const hasQuery = path.includes('?');
      const [basePath, queryString] = hasQuery ? path.split('?') : [path, ''];
      const pathParams = hasQuery ? new URLSearchParams(queryString) : new URLSearchParams();
      
      // Special handling for pipeline tabs
      if (basePath === '/pipeline' && pathParams.has('tab')) {
        const requestedTab = pathParams.get('tab');
        const currentTab = pathData.params.get('tab');
        
        // Pipeline base route is active if:
        // 1. User is on the pipeline page
        // 2. The current tab matches the requested tab
        return (
          pathData.pathname === '/pipeline' && 
          (requestedTab === currentTab)
        );
      }
      
      // Special case for /pipeline with no tab specified
      if (path === '/pipeline' && pathData.pathname === '/pipeline') {
        return true;
      }
      
      // Handle redirected routes
      if (['/ideas', '/review-queue', '/drafts', '/ready-to-publish', '/published'].includes(path)) {
        if (pathData.pathname === '/pipeline') {
          const currentTab = pathData.params.get('tab');
          if (path === '/ideas' && currentTab === 'ideas') return true;
          if (path === '/review-queue' && currentTab === 'review') return true;
          if (path === '/drafts' && currentTab === 'drafts') return true;
          if (path === '/ready-to-publish' && currentTab === 'ready') return true;
          if (path === '/published' && currentTab === 'published') return true;
        }
        return false;
      }
      
      // For regular routes, just check if the current pathname starts with the given path
      return pathData.pathname.startsWith(basePath);
    },
    [pathData]
  );

  return {
    isRouteActive,
    currentPath: pathData.fullPath
  };
}
