
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
  const streamRef = useRef<MediaStream | null>(null);

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

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Helper function to get supported MIME type
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm', 
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav',
      ''  // Empty string means browser default
    ];
    
    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) {
        console.log(`Using supported audio MIME type: ${type || 'browser default'}`);
        return type;
      }
    }
    
    // Fallback to default if none supported (shouldn't happen)
    console.log("No explicitly supported types found, using browser default");
    return '';
  };

  const startRecording = useCallback(async () => {
    try {
      // Request audio with high quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Get supported MIME type for this browser
      const mimeType = getSupportedMimeType();
      
      // Create media recorder with optimal settings for speech
      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000
      };
      
      // Only add mimeType if it's supported and not empty
      if (mimeType) {
        recorderOptions.mimeType = mimeType;
      }
      
      const recorder = new MediaRecorder(stream, recorderOptions);
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      
      // Collect data as it becomes available
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
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions and try again.");
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
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
    pauseRecording: pauseRecording,
    stopRecording: stopRecording,
    resetRecording: resetRecording
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
