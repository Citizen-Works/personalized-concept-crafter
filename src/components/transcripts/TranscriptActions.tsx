
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle, FileText, Download } from "lucide-react";

interface TranscriptActionsProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
  onOpenRecording: () => void; // We'll keep the prop but won't use it
  onExport: () => void;
  hasTranscripts: boolean;
}

const TranscriptActions: React.FC<TranscriptActionsProps> = ({ 
  onOpenUpload, 
  onOpenAddText,
  onExport,
  hasTranscripts
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold">Meeting Transcripts</h1>
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
        {hasTranscripts && (
          <Button
            onClick={onExport}
            variant="secondary"
            className="flex-1 sm:flex-initial"
            aria-label="Export transcripts"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
};

export default TranscriptActions;
