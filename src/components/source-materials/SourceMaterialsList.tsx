
import React from 'react';
import { Document } from '@/types';
import { Button } from "@/components/ui/button";
import { DocumentContentCard } from '@/components/shared';
import { ResponsiveDocumentGrid } from '@/components/ui/responsive-document-grid';
import { useIsMobile } from '@/hooks/use-mobile';

interface SourceMaterialsListProps {
  filteredDocuments: Document[];
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onClearFilters: () => void;
  isDocumentProcessing?: (id: string) => boolean;
}

interface EmptyStateProps {
  onClearFilters: () => void;
}

/**
 * Displays an empty state when no source materials match the filter criteria
 */
const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`text-center ${isMobile ? 'p-4' : 'p-8'} border rounded-md bg-muted/10`}>
      <p className={`text-muted-foreground mb-2 ${isMobile ? 'text-sm' : ''}`}>
        No materials match your {isMobile ? 'criteria' : 'search or filter criteria'}
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
};

/**
 * Displays a list of source materials with responsive grid layout
 * that adapts to mobile and desktop screen sizes.
 */
const SourceMaterialsList: React.FC<SourceMaterialsListProps> = ({
  filteredDocuments,
  onViewDocument,
  onProcessTranscript,
  onClearFilters,
  isDocumentProcessing = () => false
}) => {
  if (filteredDocuments.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  const handleViewDocument = (document: Document) => {
    onViewDocument(document.id);
  };

  return (
    <ResponsiveDocumentGrid className="gap-3 md:gap-4">
      {filteredDocuments.map((doc) => (
        <DocumentContentCard
          key={doc.id}
          document={doc}
          onView={handleViewDocument}
          onProcess={onProcessTranscript}
          isProcessing={isDocumentProcessing(doc.id)}
        />
      ))}
    </ResponsiveDocumentGrid>
  );
};

export default SourceMaterialsList;
