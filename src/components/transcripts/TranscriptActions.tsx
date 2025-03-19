
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle } from "lucide-react";

interface TranscriptActionsProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

const TranscriptActions: React.FC<TranscriptActionsProps> = ({ 
  onOpenUpload, 
  onOpenAddText 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Meeting Transcripts</h1>
      <div className="flex gap-2">
        <Button onClick={onOpenAddText} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Text
        </Button>
        <Button onClick={onOpenUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default TranscriptActions;
