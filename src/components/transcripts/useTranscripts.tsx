
import { useEffect } from 'react';
import { useTranscriptList } from '@/hooks/transcripts/useTranscriptList';
import { useTranscriptProcessing } from '@/hooks/transcripts/useTranscriptProcessing';
import { useTranscriptDialogs } from '@/hooks/transcripts/useTranscriptDialogs';
import { useTranscriptUpload } from '@/hooks/transcripts/useTranscriptUpload';

export const useTranscripts = () => {
  // Use our new smaller hooks
  const {
    documents,
    isLoading,
    selectedTranscript,
    transcriptContent,
    handleViewTranscript,
    handleExportTranscripts
  } = useTranscriptList();

  const {
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing
  } = useTranscriptProcessing(documents);

  const {
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
  } = useTranscriptDialogs();

  const {
    handleUploadDocument,
    handleAddText,
    handleAddRecording
  } = useTranscriptUpload();

  // Handle custom events for empty state buttons
  useEffect(() => {
    const handleOpenUploadDialog = () => setIsUploadDialogOpen(true);
    const handleOpenAddTextDialog = () => setIsAddTextDialogOpen(true);
    const handleOpenRecordingDialog = () => setIsRecordingDialogOpen(true);
    
    window.addEventListener('open-upload-dialog', handleOpenUploadDialog);
    window.addEventListener('open-add-text-dialog', handleOpenAddTextDialog);
    window.addEventListener('open-recording-dialog', handleOpenRecordingDialog);
    
    return () => {
      window.removeEventListener('open-upload-dialog', handleOpenUploadDialog);
      window.removeEventListener('open-add-text-dialog', handleOpenAddTextDialog);
      window.removeEventListener('open-recording-dialog', handleOpenRecordingDialog);
    };
  }, [setIsUploadDialogOpen, setIsAddTextDialogOpen, setIsRecordingDialogOpen]);

  // Hook for viewing transcripts that combines functionality
  const viewTranscript = (content: string) => {
    handleViewTranscript(content);
    setIsViewOpen(true);
  };

  return {
    // List and general state
    documents,
    isLoading,
    isProcessing,
    selectedTranscript,
    transcriptContent,
    ideas,
    processingDocuments,
    isDocumentProcessing,
    
    // Dialog states
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    
    // Dialog setters
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen,
    
    // Actions
    handleViewTranscript: viewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts
  };
};
