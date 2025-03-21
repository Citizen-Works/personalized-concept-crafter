
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
  const { processTranscript } = useDocuments();
  
  // Wrap processTranscript to match expected function signature (Promise<void> instead of Promise<boolean>)
  const processTranscriptWrapper = useCallback(
    async (id: string) => {
      await processTranscript(id);
      // Return void explicitly to match expected type
    },
    [processTranscript]
  );
  
  // Use the processing hook for core functionality
  const {
    isProcessing,
    ideas,
    processingDocuments,
    handleProcessTranscript,
    isDocumentProcessing,
    updateProcessingDocuments,
    cancelProcessing
  } = useDocumentProcessing(documents, processTranscriptWrapper);
  
  // Use the status monitor to track document status changes
  const { retryAttempts, getRetryCount } = useDocumentStatusMonitor(
    documents,
    new Set(processingDocuments),
    updateProcessingDocuments,
    handleProcessTranscript
  );
  
  return useMemo(() => ({
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing,
    retryCount: (id: string) => getRetryCount(id),
    cancelProcessing
  }), [
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing,
    getRetryCount,
    cancelProcessing
  ]);
};
