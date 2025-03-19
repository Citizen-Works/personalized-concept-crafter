
import React from 'react';
import {
  DialogHeader as UIDialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  isRecording: boolean;
  isPaused: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({
  isRecording,
  isPaused
}) => {
  return (
    <UIDialogHeader>
      <DialogTitle>{isRecording || isPaused ? "Recording in Progress" : "Voice to Text"}</DialogTitle>
      <DialogDescription>
        {isRecording || isPaused 
          ? "Speak clearly to capture your meeting or conversation" 
          : "Record audio to automatically transcribe to text"}
      </DialogDescription>
    </UIDialogHeader>
  );
};

export default DialogHeader;
