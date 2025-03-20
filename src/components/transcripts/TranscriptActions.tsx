
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, FileText, Download, Mic } from "lucide-react";
import AdminLink from './AdminLink';

interface TranscriptActionsProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
  onOpenRecording: () => void;
  onExport: () => void;
  hasTranscripts: boolean;
}

const TranscriptActions: React.FC<TranscriptActionsProps> = ({
  onOpenUpload,
  onOpenAddText,
  onOpenRecording,
  onExport,
  hasTranscripts
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center mb-8 gap-4">
      <div className="flex items-center gap-2 flex-1">
        <FileText className="h-7 w-7" />
        <h1 className="text-2xl font-bold">Meeting Transcripts</h1>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
        <Button variant="outline" onClick={onOpenAddText}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Text
        </Button>
        <Button variant="outline" onClick={onOpenRecording}>
          <Mic className="h-4 w-4 mr-2" />
          Record Voice
        </Button>
        <Button onClick={onOpenUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        {hasTranscripts && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
        <AdminLink />
      </div>
    </div>
  );
};

export default TranscriptActions;
