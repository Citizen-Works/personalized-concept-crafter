
import { useState, useEffect, useMemo } from 'react';

export function useMediaQuery(query: string): boolean {
  const mediaQuery = useMemo(() => query, [query]);
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    
    const media = window.matchMedia(mediaQuery);
    
    // Set initial value
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    
    // Modern way to add event listeners
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [mediaQuery]);

  return matches;
}
