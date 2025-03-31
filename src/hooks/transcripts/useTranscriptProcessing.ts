import { useMemo, useCallback } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useDocumentProcessing } from './processing/useDocumentProcessing';
import { useDocumentStatusMonitor } from './processing/useDocumentStatusMonitor';

// Export the interfaces for backward compatibility
export interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

export interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useTranscriptProcessing = (documents: Document[] = []) => {
  const navigate = useNavigate();
  
  // Use the processing hook for core functionality
  const {
    isProcessing,
    ideas,
    processingDocuments,
    processingError,
    isProgressDialogOpen,
    handleProcessTranscript: baseHandleProcessTranscript,
    isDocumentProcessing,
    updateProcessingDocuments,
    cancelProcessing,
    handleViewIdeas,
    setIsProgressDialogOpen,
    setProcessingError
  } = useDocumentProcessing(documents);
  
  // Convert the array to Set<string> for the status monitor
  const processingDocumentsSet = useMemo(() => 
    new Set<string>(processingDocuments), [processingDocuments]
  );
  
  // Complete rewrite of updateProcessingDocumentsWrapper to fix the type issue
  const updateProcessingDocumentsWrapper = useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      // Get the current processingDocuments as a Set
      const currentSet = new Set<string>(processingDocuments);
      // Apply the updater function to get the new Set
      const updatedSet = updater(currentSet);
      // Convert the Set back to an array and update
      const updatedArray = Array.from(updatedSet);
      // Call updateProcessingDocuments with the new array directly
      updateProcessingDocuments(updatedArray);
    },
    [processingDocuments, updateProcessingDocuments]
  );
  
  // Use the status monitor to track document status changes
  const { retryAttempts, getRetryCount } = useDocumentStatusMonitor(
    documents,
    processingDocumentsSet,
    updateProcessingDocumentsWrapper,
    baseHandleProcessTranscript
  );

  // Wrap the base handleProcessTranscript to ensure the dialog is shown
  const handleProcessTranscript = useCallback(async (id: string) => {
    console.log('useTranscriptProcessing: Starting process for document:', id);
    setIsProgressDialogOpen(true); // Set dialog open immediately
    try {
      console.log('useTranscriptProcessing: Calling base handler');
      await baseHandleProcessTranscript(id);
      console.log('useTranscriptProcessing: Base handler completed');
    } catch (error) {
      console.error('useTranscriptProcessing: Error in handleProcessTranscript:', error);
      setProcessingError(error instanceof Error ? error.message : 'Failed to process document');
      throw error;
    }
  }, [baseHandleProcessTranscript, setIsProgressDialogOpen, setProcessingError]);
  
  return useMemo(() => ({
    isProcessing,
    processingDocuments,
    ideas,
    processingError,
    isProgressDialogOpen,
    handleProcessTranscript,
    isDocumentProcessing,
    retryCount: (id: string) => getRetryCount(id),
    cancelProcessing,
    handleViewIdeas,
    setIsProgressDialogOpen
  }), [
    isProcessing,
    processingDocuments,
    ideas,
    processingError,
    isProgressDialogOpen,
    handleProcessTranscript,
    isDocumentProcessing,
    getRetryCount,
    cancelProcessing,
    handleViewIdeas,
    setIsProgressDialogOpen
  ]);
};
