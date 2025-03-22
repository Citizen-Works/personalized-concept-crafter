
import { useState, useEffect, useMemo } from 'react';

/**
 * A hook for detecting if a media query matches.
 * 
 * @param query The media query to check
 * @returns boolean - true if the media query matches, false otherwise
 */
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
    
    // Set initial value after component mounts to avoid SSR hydration issues
    setMatches(media.matches);
    
    // Handler function - optimized to minimize reference changes
    const listener = () => setMatches(media.matches);
    
    // Modern API: addEventListener/removeEventListener
    media.addEventListener("change", listener);
    
    // Clean up function
    return () => media.removeEventListener("change", listener);
  }, [mediaQuery]);

  // Return memoized value to prevent unnecessary re-renders downstream
  return matches;
}
