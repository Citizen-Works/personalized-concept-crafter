
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRecording, isPaused]);

  // Memoize formatter to prevent unnecessary rerenders
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        // Create blob from accumulated chunks
        const chunks = audioChunks;
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      recorder.start(1000);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone");
    }
  }, [audioChunks]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
        toast.success("Recording resumed");
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
        toast.success("Recording paused");
      }
    }
  }, [mediaRecorder, isRecording, isPaused]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && (isRecording || isPaused)) {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      setIsPaused(false);
      
      // The audioBlob will be set in the onstop handler
      toast.success("Recording stopped");
    }
  }, [mediaRecorder, isRecording, isPaused]);

  const resetRecording = useCallback(() => {
    if (isRecording || isPaused) {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setAudioChunks([]);
    setAudioBlob(null);
    setRecordingTime(0);
  }, [isRecording, isPaused, mediaRecorder]);

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
