
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PlusCircle, Upload } from "lucide-react";
import TranscriptList from '@/components/transcripts/TranscriptList';
import TranscriptActions from '@/components/transcripts/TranscriptActions';
import TranscriptViewDialog from '@/components/transcripts/TranscriptViewDialog';
import IdeasDialog from '@/components/transcripts/IdeasDialog';
import UploadDialog from '@/components/transcripts/UploadDialog';
import AddTextDialog from '@/components/transcripts/AddTextDialog';
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
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    handleViewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText
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

  const pageContent = (
    <div className="container mx-auto py-6">
      <TranscriptActions 
        onOpenUpload={() => setIsUploadDialogOpen(true)}
        onOpenAddText={() => setIsAddTextDialogOpen(true)}
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
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <MainLayout />
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="container py-4 px-2 sm:py-6 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 max-w-7xl mx-auto animate-fade-in">
          {pageContent}
        </div>
      </main>
    </div>
  );
};

export default TranscriptsPage;
