
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, StopCircle, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  recordingTime: number;
  formatTime: (seconds: number) => string;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
  processingProgress?: number;
  processingStage?: 'idle' | 'preparing' | 'uploading' | 'transcribing' | 'complete';
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isTranscribing,
  recordingTime,
  formatTime,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  processingProgress = 0,
  processingStage = 'idle'
}) => {
  // Helper function to get stage description
  const getStageDescription = (stage: string) => {
    switch(stage) {
      case 'preparing': return 'Preparing audio...';
      case 'uploading': return 'Uploading audio...';
      case 'transcribing': return 'Transcribing audio...';
      case 'complete': return 'Transcription complete!';
      default: return 'Processing...';
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {!isRecording && !isTranscribing && (
        <Alert variant="default" className="bg-muted/50 border-muted">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Make sure your microphone is working and speak clearly for best results.
          </AlertDescription>
        </Alert>
      )}
      
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
            onClick={onStartRecording} 
            className="flex-1"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <>
            <Button 
              onClick={onPauseRecording} 
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
              onClick={onStopRecording} 
              variant="default"
              disabled={recordingTime < 1}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              {recordingTime < 1 ? "Recording..." : "Stop"}
            </Button>
          </>
        )}
        
        {isTranscribing && (
          <div className="flex flex-col items-center justify-center w-full space-y-3">
            <div className="flex items-center justify-center w-full">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>{getStageDescription(processingStage)}</span>
            </div>
            <div className="w-full">
              <Progress value={processingProgress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center mt-1">
                {processingProgress}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingControls;
