
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlignLeft, BrainCircuit, PlusCircle, Upload } from "lucide-react";
import { format } from "date-fns";
import { Document } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface TranscriptListProps {
  documents: Document[];
  isLoading: boolean;
  isProcessing: boolean;
  selectedTranscript: string | null;
  onView: (content: string) => void;
  onProcess: (id: string) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({
  documents,
  isLoading,
  isProcessing,
  selectedTranscript,
  onView,
  onProcess,
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
        <Card key={doc.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="line-clamp-1 text-lg">{doc.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(doc.createdAt, "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {doc.content.substring(0, 150)}...
            </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(doc.content)}
            >
              <AlignLeft className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onProcess(doc.id)}
              disabled={isProcessing && selectedTranscript === doc.id}
            >
              {isProcessing && selectedTranscript === doc.id ? (
                "Processing..."
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  Extract Ideas
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
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
        Upload transcripts or add text to extract content ideas.
      </p>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => window.dispatchEvent(new CustomEvent('open-add-text-dialog'))}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Text
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
