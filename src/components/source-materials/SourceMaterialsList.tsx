
import React from 'react';
import { Button } from "@/components/ui/button";
import { Document } from '@/types';
import { SourceMaterialCard } from './SourceMaterialCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface SourceMaterialsListProps {
  filteredDocuments: Document[];
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onClearFilters: () => void;
}

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
  const isMobile = useIsMobile();
  
  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center p-4 sm:p-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground mb-2">
          No materials match your search or filter criteria
        </p>
        <Button 
          variant="link" 
          onClick={onClearFilters}
          size={isMobile ? "sm" : "default"}
        >
          Clear filters
        </Button>
      </div>
    );
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
