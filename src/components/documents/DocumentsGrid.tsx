
import React from 'react';
import { Document } from '@/types';
import { DocumentContentCard } from '@/components/shared';

interface DocumentsGridProps {
  documents: Document[];
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onArchive: (id: string) => void;
  onProcess: (id: string) => void;
  isProcessing: (id: string) => boolean;
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  onView,
  onEdit,
  onArchive,
  onProcess,
  isProcessing
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentContentCard
          key={document.id}
          document={document}
          onView={onView}
          onEdit={onEdit}
          onArchive={onArchive}
          onProcess={onProcess}
          isProcessing={isProcessing(document.id)}
        />
      ))}
    </div>
  );
};

export default DocumentsGrid;
