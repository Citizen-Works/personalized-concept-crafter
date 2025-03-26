import { useEffect } from 'react';
import { useTranscriptList } from '@/hooks/transcripts/useTranscriptList';
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
    handleUploadDocument: uploadDocumentOriginal,
    handleAddText: addTextOriginal,
    handleAddRecording: addRecordingOriginal,
    isUploading
  } = useTranscriptUpload();

  // Adapt function signatures to match expected component props
  const handleUploadDocument = async (file: File, title: string): Promise<void> => {
    await uploadDocumentOriginal(file, title);
  };

  const handleAddText = async (text: string, title: string): Promise<void> => {
    await addTextOriginal(title, text);
  };

  const handleAddRecording = async (text: string, title: string): Promise<void> => {
    // This is a placeholder - in real implementation, 
    // we would need to convert text to Blob for recording
    const dummyBlob = new Blob([text], { type: 'text/plain' });
    await addRecordingOriginal(title, dummyBlob);
  };

  return {
    // Document state
    documents,
    isLoading,
    selectedTranscript,
    transcriptContent,
    
    // Dialog state
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    
    // Dialog actions
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen,
    
    // Document actions
    handleViewTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts,
    
    // Upload state
    isUploading
  };
};
