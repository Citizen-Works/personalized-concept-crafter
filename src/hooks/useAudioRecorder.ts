
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useRecorder } from './useRecorder';
import { useTranscriptionProcessor } from './useTranscriptionProcessor';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecorder({ onTranscriptionComplete }: UseAudioRecorderProps = {}) {
  // Use the dedicated recorder hook for audio recording functionality
  const recorderState = useRecorder();
  
  // Use the dedicated transcription processor hook for transcription functionality
  const transcriptionState = useTranscriptionProcessor({
    onTranscriptionComplete
  });

  // Enhanced stop recording to automatically start transcription
  const stopRecording = useCallback(async () => {
    if (!recorderState.isRecording) {
      return;
    }
    
    recorderState.stopRecording();
    transcriptionState.setIsTranscribing(true);
    
    // Clear any existing toast
    toast.success("Recording stopped, transcribing audio...");
    
    // We need to wait for the audioBlob to be set after stopping
    setTimeout(() => {
      if (recorderState.audioBlob) {
        transcriptionState.processAudioForTranscription(recorderState.audioBlob);
      } else {
        // Check again after a short delay in case the blob hasn't been set yet
        setTimeout(() => {
          if (recorderState.audioBlob) {
            transcriptionState.processAudioForTranscription(recorderState.audioBlob);
          } else {
            transcriptionState.setIsTranscribing(false);
            transcriptionState.hasError = true;
            toast.error("No audio data captured");
          }
        }, 500);
      }
    }, 500);
  }, [recorderState.audioBlob, recorderState.stopRecording, recorderState.isRecording, transcriptionState]);

  // Enhanced reset that clears transcription state
  const resetRecording = useCallback(() => {
    recorderState.resetRecording();
    transcriptionState.resetTranscription();
  }, [recorderState.resetRecording, transcriptionState.resetTranscription]);

  // Memoize the return value to prevent unnecessary rerenders in consuming components
  return useMemo(() => ({
    isRecording: recorderState.isRecording,
    isPaused: recorderState.isPaused,
    isTranscribing: transcriptionState.isTranscribing,
    hasError: transcriptionState.hasError,
    recordingTime: recorderState.recordingTime,
    transcribedText: transcriptionState.transcribedText,
    formatTime: recorderState.formatTime,
    startRecording: recorderState.startRecording,
    pauseRecording: recorderState.pauseRecording,
    stopRecording,
    resetRecording,
    setTranscribedText: transcriptionState.setTranscribedText,
    // Progress states
    processingProgress: transcriptionState.processingProgress,
    processingStage: transcriptionState.processingStage
  }), [
    recorderState.isRecording,
    recorderState.isPaused,
    recorderState.recordingTime,
    recorderState.formatTime,
    recorderState.startRecording,
    recorderState.pauseRecording,
    transcriptionState.isTranscribing,
    transcriptionState.hasError,
    transcriptionState.transcribedText,
    transcriptionState.processingProgress,
    transcriptionState.processingStage,
    stopRecording,
    resetRecording
  ]);
}
