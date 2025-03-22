
import { useState, useEffect, useMemo } from "react"
import { useMediaQuery } from "./useMediaQuery"

// Define the mobile breakpoint as a constant for better maintainability
export const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current device is a mobile device.
 * Uses the `useMediaQuery` hook with a standardized mobile breakpoint.
 * 
 * @returns boolean - true if the device is mobile, false otherwise
 */
export function useIsMobile() {
  // Use the existing useMediaQuery hook with the mobile breakpoint
  const matches = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  
  // This ensures a consistent value while the component is mounted
  // preventing unnecessary re-renders
  const isMobile = useMemo(() => matches, [matches])
  
  // For debugging in development only
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      console.log(`Device detected as: ${isMobile ? 'mobile' : 'desktop'}`);
    }, [isMobile]);
  }
  
  return isMobile
}
