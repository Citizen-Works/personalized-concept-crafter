import React from 'react';
import { Document } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentContentCard } from '@/components/shared';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Upload, Mic } from "lucide-react";
import { ResponsiveDocumentGrid } from '@/components/ui/responsive-document-grid';
import { useIsMobile } from '@/hooks/use-mobile';

interface TranscriptListProps {
  documents: Document[];
  isLoading: boolean;
  isProcessing: boolean;
  selectedTranscript: string | null;
  processingDocuments?: Set<string>;
  isDocumentProcessing?: (id: string) => boolean;
  onView: (content: string) => void;
  onProcess: (id: string) => void;
  onCancelProcessing?: (id: string) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({
  documents,
  isLoading,
  isProcessing,
  selectedTranscript,
  processingDocuments = new Set(),
  isDocumentProcessing = (id) => processingDocuments.has(id),
  onView,
  onProcess,
  onCancelProcessing
}) => {
  const isMobile = useIsMobile();
  
  console.log('TranscriptList render:', {
    documentsCount: documents.length,
    isLoading,
    isProcessing,
    selectedTranscript,
    processingDocumentsCount: processingDocuments.size
  });
  
  if (isLoading) {
    return (
      <ResponsiveDocumentGrid>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </ResponsiveDocumentGrid>
    );
  }

  if (documents.length === 0) {
    console.log('No documents found, showing empty state');
    return <TranscriptEmptyState />;
  }

  console.log('Rendering documents:', documents);
  
  return (
    <ResponsiveDocumentGrid>
      {documents.map((doc) => (
        <DocumentContentCard
          key={doc.id}
          document={doc}
          onView={() => onView(doc.content)}
          onProcess={onProcess}
          isProcessing={isDocumentProcessing(doc.id)}
        />
      ))}
    </ResponsiveDocumentGrid>
  );
};

const TranscriptEmptyState: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="bg-muted/50">
      <CardContent className={`flex flex-col items-center justify-center ${isMobile ? 'py-8 px-4' : 'py-12'}`}>
        <FileText className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-muted-foreground mb-4`} />
        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-center`}>No Documents Yet</h3>
        <p className="text-muted-foreground text-center mt-2 max-w-md">
          Upload transcripts, add text, or record your voice to extract content ideas.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={() => window.dispatchEvent(new CustomEvent('open-add-text-dialog'))}
          >
            <PlusCircle className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
            Add Text
          </Button>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => window.dispatchEvent(new CustomEvent('open-recording-dialog'))}
          >
            <Mic className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
            Record Voice
          </Button>
          <Button 
            size={isMobile ? "sm" : "default"}
            onClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
          >
            <Upload className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
            Upload Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptList;
