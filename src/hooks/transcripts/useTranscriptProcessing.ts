
import { useMemo } from 'react';
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
  
  // Use the processing hook for core functionality
  const {
    isProcessing,
    ideas,
    processingDocuments,
    handleProcessTranscript,
    isDocumentProcessing,
    updateProcessingDocuments
  } = useDocumentProcessing(documents, processTranscript);
  
  // Use the status monitor to track document status changes
  const { retryAttempts, getRetryCount } = useDocumentStatusMonitor(
    documents,
    processingDocuments,
    updateProcessingDocuments,
    handleProcessTranscript
  );
  
  return useMemo(() => ({
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing,
    retryCount: (id: string) => getRetryCount(id)
  }), [
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing,
    getRetryCount
  ]);
};
