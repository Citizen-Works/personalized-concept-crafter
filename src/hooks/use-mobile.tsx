
import * as React from "react"
import { useMediaQuery } from "./useMediaQuery"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Use the existing useMediaQuery hook with the mobile breakpoint
  const matches = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  
  // Return memoized value to prevent unnecessary re-renders
  return React.useMemo(() => matches, [matches])
}
