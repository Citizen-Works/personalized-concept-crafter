
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle, FileText } from "lucide-react";

interface TranscriptActionsProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

const TranscriptActions: React.FC<TranscriptActionsProps> = ({ 
  onOpenUpload, 
  onOpenAddText 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold">Meeting Transcripts</h1>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          onClick={onOpenAddText} 
          variant="outline" 
          className="flex-1 sm:flex-initial"
          aria-label="Add text content"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Text
        </Button>
        <Button 
          onClick={onOpenUpload} 
          className="flex-1 sm:flex-initial"
          aria-label="Upload transcript document"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default TranscriptActions;
