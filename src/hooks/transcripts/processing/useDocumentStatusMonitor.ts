
import { useEffect, useCallback } from 'react';
import { Document } from '@/types';
import { useRetryLogic } from './useRetryLogic';

/**
 * Hook to monitor document processing status and handle state changes
 */
export const useDocumentStatusMonitor = (
  documents: Document[] = [],
  processingDocuments: Set<string>,
  updateProcessingDocuments: (updater: (prev: Set<string>) => Set<string>) => void,
  handleProcessTranscript: (id: string, isRetry: boolean) => Promise<void>
) => {
  // Use the retry logic hook for managing retries
  const { retryAttempts, handleRetry, handleSuccess, getRetryCount } = useRetryLogic(handleProcessTranscript);
  
  // Effect to monitor document status changes
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    
    // Check each document being tracked in the processingDocuments set
    processingDocuments.forEach(docId => {
      const document = documents.find(d => d.id === docId);
      
      if (!document) {
        // Document not found, remove from tracking
        updateProcessingDocuments(prev => {
          const updated = new Set<string>([...prev]);
          updated.delete(docId);
          return updated;
        });
        return;
      }
      
      if (document.processing_status === 'completed') {
        // Processing completed successfully
        handleSuccess(docId, document.title);
        updateProcessingDocuments(prev => {
          const updated = new Set<string>([...prev]);
          updated.delete(docId);
          return updated;
        });
      } 
      else if (document.processing_status === 'failed') {
        // Processing failed, attempt retry
        const retrySuccessful = handleRetry(docId, document.title);
        
        if (!retrySuccessful) {
          // If retry not attempted, remove from tracking
          updateProcessingDocuments(prev => {
            const updated = new Set<string>([...prev]);
            updated.delete(docId);
            return updated;
          });
        }
      }
    });
  }, [documents, processingDocuments, handleRetry, handleSuccess, updateProcessingDocuments]);
  
  return {
    retryAttempts,
    getRetryCount
  };
};
