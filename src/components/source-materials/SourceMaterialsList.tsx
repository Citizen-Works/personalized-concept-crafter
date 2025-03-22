
import React from 'react';
import { Button } from "@/components/ui/button";
import { Document } from '@/types';
import { SourceMaterialCard } from './SourceMaterialCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { createResponsiveComponent } from '@/components/ui/responsive-container';

interface SourceMaterialsListProps {
  filteredDocuments: Document[];
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onClearFilters: () => void;
}

interface EmptyStateProps {
  onClearFilters: () => void;
}

// Desktop empty state
const DesktopEmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => (
  <div className="text-center p-8 border rounded-md bg-muted/10">
    <p className="text-muted-foreground mb-2">
      No materials match your search or filter criteria
    </p>
    <Button 
      variant="link" 
      onClick={onClearFilters}
      size="default"
    >
      Clear filters
    </Button>
  </div>
);

// Mobile empty state
const MobileEmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => (
  <div className="text-center p-4 border rounded-md bg-muted/10">
    <p className="text-muted-foreground text-sm mb-2">
      No materials match your criteria
    </p>
    <Button 
      variant="link" 
      onClick={onClearFilters}
      size="sm"
    >
      Clear filters
    </Button>
  </div>
);

// Responsive empty state
const ResponsiveEmptyState = createResponsiveComponent<EmptyStateProps>(
  DesktopEmptyState,
  MobileEmptyState
);

/**
 * Displays a list of source materials with responsive grid layout
 * that adapts to mobile and desktop screen sizes.
 */
const SourceMaterialsList: React.FC<SourceMaterialsListProps> = ({
  filteredDocuments,
  onViewDocument,
  onProcessTranscript,
  onClearFilters
}) => {
  if (filteredDocuments.length === 0) {
    return <ResponsiveEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1">
      {filteredDocuments.map((doc) => (
        <SourceMaterialCard 
          key={doc.id}
          document={doc}
          onView={() => onViewDocument(doc.id)}
          onProcess={() => onProcessTranscript(doc.id)}
        />
      ))}
    </div>
  );
};

export default SourceMaterialsList;
