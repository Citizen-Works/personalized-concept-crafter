
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a safe default during SSR
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Function to check if device is mobile
    const checkIfMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    
    // Initial check after mount
    setIsMobile(checkIfMobile());
    
    // Handler for resize events
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return memoized value to prevent unnecessary re-renders
  return React.useMemo(() => isMobile, [isMobile]);
}
