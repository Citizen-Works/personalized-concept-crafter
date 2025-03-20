
import { useState } from 'react';

export const useTranscriptDialogs = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isIdeasDialogOpen, setIsIdeasDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  return {
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen
  };
};
