
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TranscriptionResultProps {
  transcribedText: string;
  title: string;
  onTitleChange: (title: string) => void;
}

const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  transcribedText,
  title,
  onTitleChange
}) => {
  if (!transcribedText) return null;
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="recording-title">Title</Label>
        <Input 
          id="recording-title" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          placeholder="Enter a title for this recording"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transcribed-text">Transcribed Text</Label>
        <div 
          className="p-4 bg-muted/50 rounded-md border border-border min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm"
        >
          {transcribedText}
        </div>
      </div>
    </>
  );
};

export default TranscriptionResult;
