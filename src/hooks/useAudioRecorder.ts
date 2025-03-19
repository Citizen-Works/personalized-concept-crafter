
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useRecorder } from './useRecorder';
import { transcribeAudio, TranscriptionStage } from '@/services/transcriptionService';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecorder({ onTranscriptionComplete }: UseAudioRecorderProps = {}) {
  // Use the dedicated recorder hook for audio recording functionality
  const recorderState = useRecorder();
  
  // Transcription-specific state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<TranscriptionStage>('idle');
  const [hasError, setHasError] = useState(false);

  // Handle transcription of recorded audio
  const processAudioForTranscription = useCallback(async (blob: Blob) => {
    if (!blob || blob.size === 0) {
      setHasError(true);
      setIsTranscribing(false);
      setProcessingStage('idle');
      toast.error("No audio data captured");
      return;
    }
    
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
      toast.error("Failed to transcribe audio");
      setProcessingStage('idle');
      setProcessingProgress(0);
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete]);

  // Enhanced stop recording to automatically start transcription
  const stopRecording = useCallback(async () => {
    if (!recorderState.isRecording) {
      return;
    }
    
    recorderState.stopRecording();
    setIsTranscribing(true);
    
    // Clear any existing toast
    toast.success("Recording stopped, transcribing audio...");
    
    // We need to wait for the audioBlob to be set after stopping
    setTimeout(() => {
      if (recorderState.audioBlob) {
        processAudioForTranscription(recorderState.audioBlob);
      } else {
        // Check again after a short delay in case the blob hasn't been set yet
        setTimeout(() => {
          if (recorderState.audioBlob) {
            processAudioForTranscription(recorderState.audioBlob);
          } else {
            setIsTranscribing(false);
            setHasError(true);
            toast.error("No audio data captured");
          }
        }, 500);
      }
    }, 500);
  }, [recorderState.audioBlob, recorderState.stopRecording, processAudioForTranscription, recorderState.isRecording]);

  // Enhanced reset that clears transcription state
  const resetRecording = useCallback(() => {
    recorderState.resetRecording();
    setTranscribedText("");
    setProcessingProgress(0);
    setProcessingStage('idle');
    setIsTranscribing(false);
    setHasError(false);
  }, [recorderState.resetRecording]);

  // Memoize the return value to prevent unnecessary rerenders in consuming components
  return useMemo(() => ({
    isRecording: recorderState.isRecording,
    isPaused: recorderState.isPaused,
    isTranscribing,
    hasError,
    recordingTime: recorderState.recordingTime,
    transcribedText,
    formatTime: recorderState.formatTime,
    startRecording: recorderState.startRecording,
    pauseRecording: recorderState.pauseRecording,
    stopRecording,
    resetRecording,
    setTranscribedText,
    // Progress states
    processingProgress,
    processingStage
  }), [
    recorderState.isRecording,
    recorderState.isPaused,
    recorderState.recordingTime,
    recorderState.formatTime,
    recorderState.startRecording,
    recorderState.pauseRecording,
    isTranscribing,
    hasError,
    transcribedText,
    stopRecording,
    resetRecording,
    processingProgress,
    processingStage
  ]);
}
