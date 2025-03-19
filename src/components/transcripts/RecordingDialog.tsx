
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, StopCircle, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface RecordingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveRecording: (text: string, title: string) => Promise<void>;
}

const RecordingDialog: React.FC<RecordingDialogProps> = ({
  isOpen,
  onOpenChange,
  onSaveRecording
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use useRef instead of useState for the interval to avoid type issues
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Create a new interval
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Clean up function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else if (intervalRef.current) {
      // If not recording or paused, clear the interval
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
      return;
    }
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64Audio = base64data.split(',')[1];
        
        try {
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
          setTranscribedText(result.text);
          if (!recordingTitle) {
            // Generate a title from the first few words
            const words = result.text.split(' ').slice(0, 5).join(' ');
            setRecordingTitle(`Recording: ${words}...`);
          }
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Failed to transcribe audio");
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process audio");
      setIsTranscribing(false);
    }
  };

  const handleSave = async () => {
    if (!transcribedText) {
      toast.error("No transcribed text to save");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSaveRecording(
        transcribedText, 
        recordingTitle || `Recording ${new Date().toLocaleString()}`
      );
      toast.success("Recording saved successfully");
      onOpenChange(false);
      
      // Reset state
      setIsRecording(false);
      setIsPaused(false);
      setAudioChunks([]);
      setTranscribedText("");
      setRecordingTitle("");
      setRecordingTime(0);
    } catch (error) {
      console.error("Error saving recording:", error);
      toast.error("Failed to save recording");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isRecording || isPaused) {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setAudioChunks([]);
    setTranscribedText("");
    setRecordingTitle("");
    setRecordingTime(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && (isRecording || isTranscribing || isSubmitting)) {
        // Prevent closing during active operations
        return;
      }
      if (!open) {
        handleCancel();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isRecording || isPaused ? "Recording in Progress" : "Voice to Text"}</DialogTitle>
          <DialogDescription>
            {isRecording || isPaused 
              ? "Speak clearly to capture your meeting or conversation" 
              : "Record audio to automatically transcribe to text"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Recording Controls */}
          {!transcribedText && (
            <div className="flex flex-col items-center justify-center space-y-4">
              {isRecording && (
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-2">{formatTime(recordingTime)}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {isPaused ? "Recording paused" : "Recording in progress..."}
                  </div>
                  <div className="animate-pulse h-4 w-4 bg-red-500 rounded-full mx-auto mb-4" 
                       style={{ animationPlayState: isPaused ? 'paused' : 'running' }}></div>
                </div>
              )}
              
              <div className="flex gap-4">
                {!isRecording && !isTranscribing && (
                  <Button 
                    onClick={startRecording} 
                    className="flex-1"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <>
                    <Button 
                      onClick={pauseRecording} 
                      variant="outline"
                    >
                      {isPaused ? (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={stopRecording} 
                      variant="default"
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
                
                {isTranscribing && (
                  <div className="flex items-center justify-center w-full">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Transcribing audio...</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Transcription Result */}
          {transcribedText && (
            <>
              <div className="space-y-2">
                <Label htmlFor="recording-title">Title</Label>
                <Input 
                  id="recording-title" 
                  value={recordingTitle} 
                  onChange={(e) => setRecordingTitle(e.target.value)} 
                  placeholder="Enter a title for this recording"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transcribed-text">Transcribed Text</Label>
                <div 
                  className="p-4 bg-muted/50 rounded-md border border-border min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm"
                >
                  {transcribedText}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isTranscribing || isSubmitting}
          >
            Cancel
          </Button>
          
          {transcribedText && (
            <Button 
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Transcript"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
