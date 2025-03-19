
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useRecorder } from './useRecorder';
import { transcribeAudio, TranscriptionStage } from '@/services/transcriptionService';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecorder({ onTranscriptionComplete }: UseAudioRecorderProps = {}) {
  // Use the dedicated recorder hook for audio recording functionality
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording: stopRecordingBase,
    resetRecording: resetRecordingBase
  } = useRecorder();

  // Transcription-specific state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<TranscriptionStage>('idle');

  // Handle transcription of recorded audio
  const processAudioForTranscription = useCallback(async (blob: Blob) => {
    if (!blob) {
      toast.error("No audio recorded");
      setIsTranscribing(false);
      setProcessingStage('idle');
      return;
    }
    
    try {
      // Use the transcriptionService to handle the API call
      const text = await transcribeAudio(blob, (progress, stage) => {
        setProcessingProgress(progress);
        setProcessingStage(stage);
      });
      
      setTranscribedText(text);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(text);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to transcribe audio");
      setProcessingStage('idle');
      setProcessingProgress(0);
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete]);

  // Enhanced stop recording to automatically start transcription
  const stopRecording = useCallback(async () => {
    stopRecordingBase();
    setIsTranscribing(true);
    toast.success("Recording stopped, transcribing audio...");
    
    // We need to wait for the audioBlob to be set after stopping
    setTimeout(() => {
      if (audioBlob) {
        processAudioForTranscription(audioBlob);
      } else {
        // Check again after a short delay in case the blob hasn't been set yet
        setTimeout(() => {
          if (audioBlob) {
            processAudioForTranscription(audioBlob);
          } else {
            setIsTranscribing(false);
            toast.error("No audio data captured");
          }
        }, 500);
      }
    }, 500);
  }, [audioBlob, processAudioForTranscription, stopRecordingBase]);

  // Enhanced reset that clears transcription state
  const resetRecording = useCallback(() => {
    resetRecordingBase();
    setTranscribedText("");
    setProcessingProgress(0);
    setProcessingStage('idle');
    setIsTranscribing(false);
  }, [resetRecordingBase]);

  return {
    isRecording,
    isPaused,
    isTranscribing,
    recordingTime,
    transcribedText,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    setTranscribedText,
    // Progress states
    processingProgress,
    processingStage
  };
}
