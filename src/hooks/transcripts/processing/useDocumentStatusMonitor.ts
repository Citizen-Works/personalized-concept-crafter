
import { useEffect } from 'react';
import { Document } from '@/types';
import { useRetryLogic } from './useRetryLogic';

/**
 * Hook for monitoring document status changes
 */
export const useDocumentStatusMonitor = (
  documents: Document[] = [],
  processingDocuments: Set<string>,
  updateProcessingDocuments: (updater: (prev: Set<string>) => Set<string>) => Set<string>,
  handleProcessTranscript: (id: string, isRetry: boolean) => Promise<void>
) => {
  const { handleRetry, handleSuccess, retryAttempts, getRetryCount } = useRetryLogic(handleProcessTranscript);
  
  // Monitor documents for status changes
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    
    let shouldUpdate = false;
    let updatedProcessingDocs = new Set<string>(processingDocuments);
    
    // Check if any documents have processing_status changes
    documents.forEach(doc => {
      const isCurrentlyProcessing = processingDocuments.has(doc.id);
      
      if (doc.processing_status === 'processing' && !isCurrentlyProcessing) {
        updatedProcessingDocs.add(doc.id);
        shouldUpdate = true;
      } else if ((doc.processing_status === 'completed' || doc.processing_status === 'failed') && isCurrentlyProcessing) {
        updatedProcessingDocs.delete(doc.id);
        
        // Show completion toast if it was in the processing set
        if (doc.processing_status === 'completed') {
          handleSuccess(doc.id, doc.title);
        } else if (doc.processing_status === 'failed') {
          // Handle retry logic
          handleRetry(doc.id, doc.title);
        }
        
        shouldUpdate = true;
      }
    });
    
    // Only update state if anything changed
    if (shouldUpdate) {
      updateProcessingDocuments(() => updatedProcessingDocs);
    }
  }, [documents, processingDocuments, updateProcessingDocuments, handleRetry, handleSuccess]);
  
  return {
    retryAttempts,
    getRetryCount
  };
};
