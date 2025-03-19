
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, StopCircle, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  recordingTime: number;
  formatTime: (seconds: number) => string;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isTranscribing,
  recordingTime,
  formatTime,
  onStartRecording,
  onPauseRecording,
  onStopRecording
}) => {
  return (
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
  );
};

export default RecordingControls;
