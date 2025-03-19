
import React from 'react';
import { Button } from "@/components/ui/button";

interface RecordingErrorProps {
  hasError: boolean;
  permissionError: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  hasTranscribedText: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}

const RecordingError: React.FC<RecordingErrorProps> = ({
  hasError,
  permissionError,
  isRecording,
  isTranscribing,
  hasTranscribedText,
  onRetry,
  isRetrying
}) => {
  if (!(hasError || permissionError) || isRecording || isTranscribing || hasTranscribedText) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center py-4">
      <p className="text-destructive mb-4">
        {permissionError 
          ? "Microphone access denied. Please check your browser settings."
          : "Recording failed. Please check your microphone and try again."}
      </p>
      <Button 
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Starting..." : "Try Again"}
      </Button>
    </div>
  );
};

export default RecordingError;
