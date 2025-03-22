
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  /**
   * Component to render on desktop devices
   */
  desktopComponent: React.ReactNode;
  /**
   * Component to render on mobile devices
   */
  mobileComponent: React.ReactNode;
  /**
   * Optional override for device detection
   */
  isMobileOverride?: boolean;
}

/**
 * A container component that renders different content based on device type.
 * Uses the useIsMobile hook to determine the current device type.
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer
 *   desktopComponent={<DesktopView data={data} />}
 *   mobileComponent={<MobileView data={data} />}
 * />
 * ```
 */
export function ResponsiveContainer({
  desktopComponent,
  mobileComponent,
  isMobileOverride,
}: ResponsiveContainerProps) {
  const isMobileDetected = useIsMobile();
  const isMobile = isMobileOverride !== undefined ? isMobileOverride : isMobileDetected;
  
  return (
    <>{isMobile ? mobileComponent : desktopComponent}</>
  );
}

/**
 * Higher-order component that creates a responsive component from separate
 * mobile and desktop implementations.
 * 
 * @example
 * ```tsx
 * const ResponsiveList = createResponsiveComponent(DesktopList, MobileList);
 * 
 * // Then use it like:
 * <ResponsiveList data={data} onItemClick={handleClick} />
 * ```
 */
export function createResponsiveComponent<P extends object>(
  DesktopComponent: React.ComponentType<P>,
  MobileComponent: React.ComponentType<P>
) {
  return function ResponsiveComponent(props: P & { isMobile?: boolean }) {
    const { isMobile: isMobileProp, ...componentProps } = props as P & { isMobile?: boolean };
    
    return (
      <ResponsiveContainer
        desktopComponent={<DesktopComponent {...componentProps as P} />}
        mobileComponent={<MobileComponent {...componentProps as P} />}
        isMobileOverride={isMobileProp}
      />
    );
  };
}
