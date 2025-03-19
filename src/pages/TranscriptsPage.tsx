import React, { useEffect } from 'react';
import TranscriptList from '@/components/transcripts/TranscriptList';
import TranscriptActions from '@/components/transcripts/TranscriptActions';
import TranscriptViewDialog from '@/components/transcripts/TranscriptViewDialog';
import IdeasDialog from '@/components/transcripts/IdeasDialog';
import UploadDialog from '@/components/transcripts/UploadDialog';
import AddTextDialog from '@/components/transcripts/AddTextDialog';
import RecordingDialog from '@/components/transcripts/RecordingDialog';
import { useTranscripts } from '@/components/transcripts/useTranscripts';

const TranscriptsPage = () => {
  const {
    documents,
    isLoading,
    isProcessing,
    selectedTranscript,
    transcriptContent,
    ideas,
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen,
    handleViewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts
  } = useTranscripts();

  // Handle custom events for empty state buttons
  useEffect(() => {
    const handleOpenUploadDialog = () => setIsUploadDialogOpen(true);
    const handleOpenAddTextDialog = () => setIsAddTextDialogOpen(true);
    
    window.addEventListener('open-upload-dialog', handleOpenUploadDialog);
    window.addEventListener('open-add-text-dialog', handleOpenAddTextDialog);
    
    return () => {
      window.removeEventListener('open-upload-dialog', handleOpenUploadDialog);
      window.removeEventListener('open-add-text-dialog', handleOpenAddTextDialog);
    };
  }, [setIsUploadDialogOpen, setIsAddTextDialogOpen]);

  const hasTranscripts = documents && documents.length > 0;

  return (
    <div className="container mx-auto py-6">
      <TranscriptActions 
        onOpenUpload={() => setIsUploadDialogOpen(true)}
        onOpenAddText={() => setIsAddTextDialogOpen(true)}
        onOpenRecording={() => setIsRecordingDialogOpen(true)} 
        onExport={handleExportTranscripts}
        hasTranscripts={hasTranscripts}
      />

      <TranscriptList 
        documents={documents}
        isLoading={isLoading}
        isProcessing={isProcessing}
        selectedTranscript={selectedTranscript}
        onView={handleViewTranscript}
        onProcess={handleProcessTranscript}
      />

      <TranscriptViewDialog 
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        content={transcriptContent}
      />

      <IdeasDialog 
        isOpen={isIdeasDialogOpen}
        onOpenChange={setIsIdeasDialogOpen}
        ideas={ideas}
      />
      
      <UploadDialog 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUploadDocument}
      />
      
      <AddTextDialog 
        isOpen={isAddTextDialogOpen}
        onOpenChange={setIsAddTextDialogOpen}
        onAddText={handleAddText}
      />
      
      <RecordingDialog
        isOpen={isRecordingDialogOpen}
        onOpenChange={setIsRecordingDialogOpen}
        onSaveRecording={handleAddRecording}
      />
    </div>
  );
};

export default TranscriptsPage;
