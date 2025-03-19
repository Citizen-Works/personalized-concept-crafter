
import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useMediaStream } from './useMediaStream';
import { useRecordingTimer } from './useRecordingTimer';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorderInitialized, setRecorderInitialized] = useState(false);
  
  // Use our new sub-hooks
  const { stream, mimeType, requestMediaStream, stopMediaStream } = useMediaStream();
  const { recordingTime, formatTime, startTimer, pauseTimer, stopTimer, resetTimer } = useRecordingTimer();

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      stopMediaStream();
      resetTimer();
    };
  }, [mediaRecorder, stopMediaStream, resetTimer]);

  const startRecording = useCallback(async () => {
    try {
      // Reset state
      setAudioChunks([]);
      setAudioBlob(null);
      resetTimer();
      setRecorderInitialized(false);
      
      // Request media stream access
      const mediaStreamData = await requestMediaStream();
      if (!mediaStreamData) {
        setIsRecording(false);
        return;
      }
      
      const { stream, mimeType } = mediaStreamData;
      
      console.log("Starting recording with stream:", stream);
      
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
      console.log("MediaRecorder created with options:", recorderOptions);

      // Store audio chunks when data is available
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        console.log("Data available event triggered, data size:", event.data.size);
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks(prevChunks => [...prevChunks, event.data]);
        }
      };
      
      recorder.onstop = () => {
        console.log("Recorder stopped, processing chunks...");
        console.log("Chunks collected:", chunks.length);
        
        if (chunks.length > 0) {
          // Create a blob from all chunks
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          console.log("Created audio blob:", {
            size: blob.size,
            type: blob.type
          });
          setAudioBlob(blob);
        } else {
          console.error("No audio chunks collected during recording");
          toast.error("No audio recorded. Please try again.");
        }
        
        setIsRecording(false);
        setIsPaused(false);
      };
      
      // Set recorder state before starting
      setMediaRecorder(recorder);
      
      // Start the recorder with a shorter timeSlice to collect data more frequently
      recorder.start(100);
      console.log("Recorder started");
      
      // Mark as recording
      setIsRecording(true);
      
      // Start the timer immediately
      startTimer();
      
      // Mark as initialized
      setRecorderInitialized(true);
      toast.success("Recording started");
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not start recording. Please try again.");
      setRecorderInitialized(false);
      setIsRecording(false);
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
      console.log("Stopping recorder...", mediaRecorder.state);
      
      // Only stop if recorder is not already inactive
      if (mediaRecorder.state !== 'inactive') {
        // Request data explicitly before stopping
        mediaRecorder.requestData();
        
        // Add a small delay to ensure data is collected
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log("Recorder stopped");
          }
          
          // Cleanup after stopping
          stopMediaStream();
          stopTimer();
          setIsRecording(false);
          setIsPaused(false);
          
          toast.success("Recording stopped");
        }, 300);
      } else {
        // Already stopped, just clean up
        stopMediaStream();
        stopTimer();
        setIsRecording(false);
        setIsPaused(false);
      }
    }
  }, [mediaRecorder, isRecording, isPaused, stopMediaStream, stopTimer]);

  const resetRecording = useCallback(() => {
    if (isRecording || isPaused) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      stopMediaStream();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setAudioChunks([]);
    setAudioBlob(null);
    setRecorderInitialized(false);
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
