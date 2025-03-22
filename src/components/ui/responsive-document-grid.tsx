
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveDocumentGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A responsive grid component for document cards that adjusts columns based on screen size.
 * 
 * @example
 * ```tsx
 * <ResponsiveDocumentGrid>
 *   {documents.map(doc => (
 *     <DocumentCard key={doc.id} document={doc} />
 *   ))}
 * </ResponsiveDocumentGrid>
 * ```
 */
export const ResponsiveDocumentGrid: React.FC<ResponsiveDocumentGridProps> = ({
  children,
  className,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        'grid gap-4',
        isMobile 
          ? 'grid-cols-1' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveDocumentGrid;
