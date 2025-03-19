
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { toast } from 'sonner';
import DialogHeader from './recording/DialogHeader';
import PermissionError from './recording/PermissionError';
import RecordingControls from './recording/RecordingControls';
import TranscriptionResult from './recording/TranscriptionResult';
import RecordingError from './recording/RecordingError';
import DialogActions from './recording/DialogActions';
import { useRetryRecording } from '@/hooks/useRetryRecording';

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
  const [permissionError, setPermissionError] = useState(false);
  
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

  const { isRetrying, handleRetry } = useRetryRecording({
    resetRecording,
    startRecording,
    setPermissionError
  });

  // Debug recording state
  useEffect(() => {
    console.log("Recording state:", { isRecording, isPaused, recordingTime });
  }, [isRecording, isPaused, recordingTime]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetRecording();
      setRecordingTitle("");
      setIsSubmitting(false);
      setPermissionError(false);
    }
  }, [isOpen, resetRecording]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetRecording();
      setRecordingTitle("");
      setIsSubmitting(false);
      setPermissionError(false);
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

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionError(true);
      }
    }
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
        <DialogHeader 
          isRecording={isRecording} 
          isPaused={isPaused} 
        />
        
        <div className="space-y-4 py-4">
          <PermissionError 
            permissionError={permissionError}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
          
          {/* Recording Controls */}
          {!transcribedText && !hasError && (
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              isTranscribing={isTranscribing}
              recordingTime={recordingTime}
              formatTime={formatTime}
              onStartRecording={handleStartRecording}
              onPauseRecording={pauseRecording}
              onStopRecording={stopRecording}
              processingProgress={processingProgress}
              processingStage={processingStage}
            />
          )}
          
          {/* Show a retry button if there was an error */}
          <RecordingError 
            hasError={hasError}
            permissionError={permissionError}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            hasTranscribedText={!!transcribedText}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
          
          {/* Transcription Result */}
          {transcribedText && (
            <TranscriptionResult
              transcribedText={transcribedText}
              title={recordingTitle}
              onTitleChange={setRecordingTitle}
            />
          )}
        </div>
        
        <DialogActions 
          hasTranscribedText={!!transcribedText}
          isTranscribing={isTranscribing}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
