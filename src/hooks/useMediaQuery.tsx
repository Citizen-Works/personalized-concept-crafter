
import { useState, useEffect, useMemo } from 'react';

export function useMediaQuery(query: string): boolean {
  // Memoize the query to prevent unnecessary re-renders
  const mediaQuery = useMemo(() => query, [query]);
  
  // Initialize with false for SSR and to prevent hydration issues
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }
    
    const media = window.matchMedia(mediaQuery);
    
    // Set initial value
    setMatches(media.matches);
    
    // Handler function
    const listener = () => setMatches(media.matches);
    
    // Add event listener
    media.addEventListener("change", listener);
    
    // Clean up function
    return () => media.removeEventListener("change", listener);
  }, [mediaQuery]);

  // Return memoized value
  return matches;
}
