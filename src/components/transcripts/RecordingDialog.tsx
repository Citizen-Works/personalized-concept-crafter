
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import RecordingControls from './recording/RecordingControls';
import TranscriptionResult from './recording/TranscriptionResult';
import { toast } from 'sonner';

interface RecordingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveRecording: (text: string, title: string) => Promise<void>;
}

const RecordingDialog: React.FC<RecordingDialogProps> = ({
  isOpen,
  onOpenChange,
  onSaveRecording
}) => {
  const [recordingTitle, setRecordingTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    isRecording,
    isPaused,
    isTranscribing,
    hasError,
    recordingTime,
    transcribedText,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    setTranscribedText,
    processingProgress,
    processingStage
  } = useAudioRecorder({
    onTranscriptionComplete: (text) => {
      if (!recordingTitle && text) {
        // Generate a title from the first few words
        const words = text.split(' ').slice(0, 5).join(' ');
        setRecordingTitle(`Recording: ${words}...`);
      }
    }
  });

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetRecording();
      setRecordingTitle("");
      setIsSubmitting(false);
    }
  }, [isOpen, resetRecording]);

  const handleSave = async () => {
    if (!transcribedText) {
      toast.error("No transcribed text to save");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSaveRecording(
        transcribedText, 
        recordingTitle || `Recording ${new Date().toLocaleString()}`
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving recording:", error);
      // Don't show another toast here - the error is already shown in the handler
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetRecording();
    setRecordingTitle("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && (isRecording || isTranscribing || isSubmitting)) {
        // Prevent closing during active operations
        return;
      }
      if (!open) {
        handleCancel();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isRecording || isPaused ? "Recording in Progress" : "Voice to Text"}</DialogTitle>
          <DialogDescription>
            {isRecording || isPaused 
              ? "Speak clearly to capture your meeting or conversation" 
              : "Record audio to automatically transcribe to text"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Recording Controls */}
          {!transcribedText && !hasError && (
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              isTranscribing={isTranscribing}
              recordingTime={recordingTime}
              formatTime={formatTime}
              onStartRecording={startRecording}
              onPauseRecording={pauseRecording}
              onStopRecording={stopRecording}
              processingProgress={processingProgress}
              processingStage={processingStage}
            />
          )}
          
          {/* Show a retry button if there was an error */}
          {hasError && !isRecording && !isTranscribing && !transcribedText && (
            <div className="flex flex-col items-center py-4">
              <p className="text-destructive mb-4">Recording failed. Please check your microphone and try again.</p>
              <Button onClick={() => {
                resetRecording();
                setTimeout(() => startRecording(), 500);
              }}>
                Try Again
              </Button>
            </div>
          )}
          
          {/* Transcription Result */}
          {transcribedText && (
            <TranscriptionResult
              transcribedText={transcribedText}
              title={recordingTitle}
              onTitleChange={setRecordingTitle}
            />
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isTranscribing || isSubmitting}
          >
            Cancel
          </Button>
          
          {transcribedText && (
            <Button 
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Transcript"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
