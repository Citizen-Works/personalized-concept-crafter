
import React from 'react';
import { Button } from "@/components/ui/button";
import { Document } from '@/types';
import { SourceMaterialCard } from './SourceMaterialCard';

interface SourceMaterialsListProps {
  filteredDocuments: Document[];
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onClearFilters: () => void;
}

const SourceMaterialsList: React.FC<SourceMaterialsListProps> = ({
  filteredDocuments,
  onViewDocument,
  onProcessTranscript,
  onClearFilters
}) => {
  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">
          No materials match your search or filter criteria
        </p>
        <Button 
          variant="link" 
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
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
