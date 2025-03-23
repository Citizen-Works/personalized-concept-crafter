
import React from 'react';
import { Document } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentContentCard } from '@/components/shared';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Upload, Mic } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return <TranscriptEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <DocumentContentCard
          key={doc.id}
          document={doc}
          onView={() => onView(doc.content)}
          onProcess={onProcess}
          isProcessing={isDocumentProcessing(doc.id)}
        />
      ))}
    </div>
  );
};

const TranscriptEmptyState: React.FC = () => (
  <Card className="bg-muted/50">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-center">No Documents Yet</h3>
      <p className="text-muted-foreground text-center mt-2 max-w-md">
        Upload transcripts, add text, or record your voice to extract content ideas.
      </p>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.dispatchEvent(new CustomEvent('open-add-text-dialog'))}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Text
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.dispatchEvent(new CustomEvent('open-recording-dialog'))}
        >
          <Mic className="h-4 w-4 mr-2" />
          Record Voice
        </Button>
        <Button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TranscriptList;
