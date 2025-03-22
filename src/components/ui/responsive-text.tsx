
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextElement = HeadingLevel | 'p' | 'span' | 'div';

interface ResponsiveTextProps {
  /**
   * The element type to render
   */
  as?: TextElement;
  /**
   * Classes to apply specifically for desktop view
   */
  desktopClasses: string;
  /**
   * Classes to apply specifically for mobile view
   */
  mobileClasses: string;
  /**
   * Classes to apply regardless of view
   */
  className?: string;
  /**
   * Content to display
   */
  children: React.ReactNode;
  /**
   * Optional ID for the element
   */
  id?: string;
}

/**
 * A component that applies different text styles based on the device type.
 * 
 * @example
 * ```tsx
 * <ResponsiveText
 *   as="h1"
 *   mobileClasses="text-2xl font-bold"
 *   desktopClasses="text-5xl font-bold"
 *   className="text-white mb-4"
 * >
 *   Welcome to our site
 * </ResponsiveText>
 * ```
 */
export const ResponsiveText = ({
  as = 'p',
  desktopClasses,
  mobileClasses,
  className = '',
  children,
  id,
  ...props
}: ResponsiveTextProps & React.HTMLAttributes<HTMLElement>) => {
  const isMobile = useIsMobile();
  const ElementType = as as React.ElementType;
  
  return (
    <ElementType 
      id={id}
      className={cn(
        isMobile ? mobileClasses : desktopClasses,
        className
      )}
      {...props}
    >
      {children}
    </ElementType>
  );
};

export default ResponsiveText;
