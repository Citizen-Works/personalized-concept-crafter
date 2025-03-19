
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useMediaStream } from './useMediaStream';
import { useRecordingTimer } from './useRecordingTimer';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  // Use our new sub-hooks
  const { stream, mimeType, requestMediaStream, stopMediaStream } = useMediaStream();
  const { recordingTime, formatTime, startTimer, pauseTimer, stopTimer, resetTimer } = useRecordingTimer();

  const startRecording = useCallback(async () => {
    try {
      // Reset state
      setAudioChunks([]);
      setAudioBlob(null);
      resetTimer();
      
      // Request media stream access
      const mediaStreamData = await requestMediaStream();
      if (!mediaStreamData) return;
      
      const { stream, mimeType } = mediaStreamData;
      
      // Create recorder options with optimal settings for speech
      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000
      };
      
      // Only add mimeType if it's supported and not empty
      if (mimeType) {
        recorderOptions.mimeType = mimeType;
      }
      
      // Create and configure the media recorder
      const recorder = new MediaRecorder(stream, recorderOptions);
      
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      
      // Set up event handlers
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        // Create blob from accumulated chunks
        const chunks = audioChunks;
        if (chunks.length > 0) {
          // Use the same mime type as we recorded with
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          console.log("Created audio blob:", {
            size: blob.size,
            type: blob.type,
            chunkCount: chunks.length
          });
          setAudioBlob(blob);
        } else {
          console.error("No audio chunks collected during recording");
          toast.error("No audio recorded. Please try again.");
        }
      };
      
      // Start recording with smaller time slices for more accurate data
      recorder.start(500);
      startTimer();
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not start recording. Please try again.");
    }
  }, [audioChunks, requestMediaStream, resetTimer, startTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
        pauseTimer();
        toast.success("Recording resumed");
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
        pauseTimer();
        toast.success("Recording paused");
      }
    }
  }, [mediaRecorder, isRecording, isPaused, pauseTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && (isRecording || isPaused)) {
      mediaRecorder.stop();
      stopMediaStream();
      stopTimer();
      
      setIsRecording(false);
      setIsPaused(false);
      
      toast.success("Recording stopped");
    }
  }, [mediaRecorder, isRecording, isPaused, stopMediaStream, stopTimer]);

  const resetRecording = useCallback(() => {
    if (isRecording || isPaused) {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      stopMediaStream();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setAudioChunks([]);
    setAudioBlob(null);
    resetTimer();
  }, [isRecording, isPaused, mediaRecorder, stopMediaStream, resetTimer]);

  // Memoize the return value to prevent unnecessary rerenders
  return useMemo(() => ({
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording
  }), [
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording
  ]);
}
