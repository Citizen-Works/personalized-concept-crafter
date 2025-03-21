
import React from 'react';
import { Document } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import SourceMaterialsFilters from './SourceMaterialsFilters';
import SourceMaterialsList from './SourceMaterialsList';
import { EmptyState } from './EmptyState';

interface SourceMaterialsContentProps {
  documents: Document[];
  filteredDocuments: Document[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  materialType: string;
  setMaterialType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

const SourceMaterialsContent: React.FC<SourceMaterialsContentProps> = ({
  documents,
  filteredDocuments,
  searchQuery,
  setSearchQuery,
  materialType,
  setMaterialType,
  sortOrder,
  setSortOrder,
  onViewDocument,
  onProcessTranscript,
  onOpenUpload,
  onOpenAddText
}) => {
  if (!documents || documents.length === 0) {
    return (
      <EmptyState 
        onOpenUpload={onOpenUpload}
        onOpenAddText={onOpenAddText}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Materials Library</CardTitle>
        <CardDescription>
          Manage your source materials for content creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <SourceMaterialsFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            materialType={materialType}
            setMaterialType={setMaterialType}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          
          <SourceMaterialsList 
            filteredDocuments={filteredDocuments}
            onViewDocument={onViewDocument}
            onProcessTranscript={onProcessTranscript}
            onClearFilters={() => {
              setSearchQuery("");
              setMaterialType("all");
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceMaterialsContent;
