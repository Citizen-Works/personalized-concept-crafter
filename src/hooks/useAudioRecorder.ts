
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useAudioRecorder({ onTranscriptionComplete }: UseAudioRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  // Add progress tracking states
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'idle' | 'preparing' | 'uploading' | 'transcribing' | 'complete'>('idle');
  
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      // Reset progress states
      setProcessingProgress(0);
      setProcessingStage('idle');
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.start(1000);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone");
    }
  };

  const pauseRecording = () => {
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
  };

  const stopRecording = async () => {
    if (mediaRecorder && (isRecording || isPaused)) {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      setIsPaused(false);
      setIsTranscribing(true);
      
      toast.success("Recording stopped, transcribing audio...");
      
      setTimeout(() => {
        processAudioForTranscription();
      }, 500);
    }
  };

  const processAudioForTranscription = async () => {
    if (audioChunks.length === 0) {
      toast.error("No audio recorded");
      setIsTranscribing(false);
      setProcessingStage('idle');
      return;
    }
    
    try {
      // Update stage to preparing
      setProcessingStage('preparing');
      setProcessingProgress(10);
      
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          // Calculate progress from 10% to 40%
          const progress = 10 + (event.loaded / event.total) * 30;
          setProcessingProgress(Math.round(progress));
        }
      };
      
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64Audio = base64data.split(',')[1];
        
        // Update stage to uploading
        setProcessingStage('uploading');
        setProcessingProgress(50);
        
        try {
          // Update stage to transcribing
          setProcessingStage('transcribing');
          setProcessingProgress(70);
          
          const response = await fetch(`${window.location.origin}/api/functions/transcribe-audio`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ audio: base64Audio })
          });
          
          if (!response.ok) {
            throw new Error(`Transcription failed: ${response.statusText}`);
          }
          
          const result = await response.json();
          
          // Update stage to complete
          setProcessingStage('complete');
          setProcessingProgress(100);
          
          setTranscribedText(result.text);
          
          if (onTranscriptionComplete) {
            onTranscriptionComplete(result.text);
          }
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Failed to transcribe audio");
          setProcessingStage('idle');
          setProcessingProgress(0);
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process audio");
      setIsTranscribing(false);
      setProcessingStage('idle');
      setProcessingProgress(0);
    }
  };

  const resetRecording = () => {
    if (isRecording || isPaused) {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setAudioChunks([]);
    setTranscribedText("");
    setRecordingTime(0);
    setProcessingProgress(0);
    setProcessingStage('idle');
  };

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
    // Return new progress states
    processingProgress,
    processingStage
  };
}
