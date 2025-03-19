
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { transcribeAudio, TranscriptionStage } from '@/services/transcriptionService';

interface UseTranscriptionProcessorProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useTranscriptionProcessor({ onTranscriptionComplete }: UseTranscriptionProcessorProps = {}) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<TranscriptionStage>('idle');
  const [hasError, setHasError] = useState(false);

  const processAudioForTranscription = useCallback(async (blob: Blob) => {
    if (!blob || blob.size === 0) {
      console.error("Empty audio blob received, size:", blob?.size);
      setHasError(true);
      setIsTranscribing(false);
      setProcessingStage('idle');
      toast.error("No audio data captured. Please try again.");
      return;
    }
    
    console.log("Processing audio for transcription:", {
      blobSize: blob.size,
      blobType: blob.type
    });
    
    try {
      setHasError(false);
      
      // Use the transcriptionService to handle the API call
      const text = await transcribeAudio(blob, (progress, stage) => {
        setProcessingProgress(progress);
        setProcessingStage(stage);
      });
      
      if (!text || text.trim() === '') {
        toast.error("No speech detected in the recording");
        setHasError(true);
        return;
      }
      
      setTranscribedText(text);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(text);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setHasError(true);
      toast.error("Failed to transcribe audio: " + (error.message || "Unknown error"));
      setProcessingStage('idle');
      setProcessingProgress(0);
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete]);

  const resetTranscription = useCallback(() => {
    setTranscribedText("");
    setProcessingProgress(0);
    setProcessingStage('idle');
    setIsTranscribing(false);
    setHasError(false);
  }, []);

  return {
    isTranscribing,
    hasError,
    transcribedText,
    setTranscribedText,
    processingProgress,
    processingStage,
    processAudioForTranscription,
    resetTranscription,
    setIsTranscribing
  };
}
