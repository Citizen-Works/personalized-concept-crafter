
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
      
      // This is critical - set up event handlers BEFORE starting recording
      recorder.ondataavailable = (e) => {
        console.log("Data available event triggered, data size:", e.data.size);
        if (e.data && e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        console.log("Recorder stopped, processing chunks...");
        // Create a local copy of chunks to work with to avoid closure issues
        const chunks = audioChunks;
        console.log("Chunks available:", chunks.length);
        
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
      
      // Now it's safe to set state values
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      
      // Start recording with smaller time slices for more frequent data events
      recorder.start(100); // 100ms time slices for more reliable data collection
      startTimer();
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not start recording. Please try again.");
    }
  }, [requestMediaStream, resetTimer, startTimer]);

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
      console.log("Stopping recorder...");
      
      // Force a final dataavailable event before stopping
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.requestData();
      }
      
      // Small delay to ensure the requestData event is processed
      setTimeout(() => {
        mediaRecorder.stop();
        stopMediaStream();
        stopTimer();
        
        setIsRecording(false);
        setIsPaused(false);
        
        toast.success("Recording stopped");
      }, 200);
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
