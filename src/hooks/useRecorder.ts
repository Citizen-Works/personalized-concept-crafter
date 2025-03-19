
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
      
      // First set recording state to true to update UI immediately
      setIsRecording(true);
      setIsPaused(false);
      
      // Request media stream access
      const mediaStreamData = await requestMediaStream();
      if (!mediaStreamData) {
        setIsRecording(false);
        return;
      }
      
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
        setRecorderInitialized(false);
        
        // Make sure we're working with the latest state by using a function
        setAudioChunks(currentChunks => {
          console.log("Chunks available:", currentChunks.length);
          
          if (currentChunks.length > 0) {
            // Use the same mime type as we recorded with
            const blob = new Blob(currentChunks, { type: mimeType || 'audio/webm' });
            console.log("Created audio blob:", {
              size: blob.size,
              type: blob.type,
              chunkCount: currentChunks.length
            });
            setAudioBlob(blob);
          } else {
            console.error("No audio chunks collected during recording");
            toast.error("No audio recorded. Please try again.");
            setIsRecording(false);
          }
          
          return currentChunks;
        });
      };
      
      // Now it's safe to set state values
      setMediaRecorder(recorder);
      
      // Start recording with smaller time slices for more frequent data events
      recorder.start(500); // Increased from 100ms to 500ms for more reliable collection
      
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
      console.log("Stopping recorder...");
      
      // Only proceed if we've successfully initialized the recorder
      if (!recorderInitialized) {
        console.log("Recorder not fully initialized, aborting stop");
        toast.error("Recording not properly initialized. Please try again.");
        resetRecording();
        return;
      }
      
      // Force data collection before stopping
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.requestData();
      }
      
      // Ensure we have some recording time before stopping
      const minRecordingTime = 1000; // 1 second in ms
      const hasMinimumRecording = recordingTime > 1;
      
      if (!hasMinimumRecording) {
        console.log("Recording too short, ensuring minimum recording time");
        // If recording is too short, wait a bit before stopping
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.requestData();
            setTimeout(() => {
              mediaRecorder.stop();
              processRecordingEnd();
            }, 500);
          }
        }, minRecordingTime);
      } else {
        // For normal recordings, give a small delay to ensure all data is collected
        setTimeout(() => {
          mediaRecorder.stop();
          processRecordingEnd();
        }, 300);
      }
    }
  }, [mediaRecorder, isRecording, isPaused, recordingTime, recorderInitialized]);
  
  // Helper function to handle common stop recording logic
  const processRecordingEnd = useCallback(() => {
    stopMediaStream();
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);
    toast.success("Recording stopped");
  }, [stopMediaStream, stopTimer]);

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
