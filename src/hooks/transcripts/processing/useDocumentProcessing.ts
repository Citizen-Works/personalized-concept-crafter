
import { useState, useCallback, useEffect } from 'react';
import { Document } from '@/types';
import { toast } from 'sonner';
import { useProcessingStorage } from './useProcessingStorage';

/**
 * Hook for managing document processing state and actions
 */
export const useDocumentProcessing = (
  documents: Document[] = [],
  processTranscript: (id: string, backgroundMode?: boolean) => Promise<any>
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ideas, setIdeas] = useState<any>(null);
  const { processingDocuments, updateProcessingDocuments } = useProcessingStorage();
  
  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    return processingDocuments.has(id) || (doc && doc.processing_status === 'processing');
  }, [processingDocuments, documents]);
  
  // Handle processing a transcript
  const handleProcessTranscript = useCallback(async (id: string, isRetry = false): Promise<void> => {
    try {
      // Mark as processing in UI
      updateProcessingDocuments(prev => {
        const updated = new Set<string>([...prev]);
        updated.add(id);
        return updated;
      });
      
      // Only show toast for initial processing, not retries
      if (!isRetry) {
        setIsProcessing(true);
        
        toast.info("Starting idea extraction in the background. You can continue using the app.", {
          duration: 5000,
          description: "You'll be notified when it's complete."
        });
      }
      
      // Process in background mode
      await processTranscript(id, true);
      
      if (!isRetry) {
        toast.success("Transcript is being processed. You'll be notified when it's complete.", {
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Failed to process transcript:", error);
      
      if (!isRetry) {
        toast.error("Failed to start idea extraction");
      }
      
      // Remove from processing list
      updateProcessingDocuments(prev => {
        const updated = new Set<string>([...prev]);
        updated.delete(id);
        return updated;
      });
    } finally {
      if (!isRetry) {
        setIsProcessing(false);
      }
    }
  }, [processTranscript, updateProcessingDocuments]);
  
  return {
    isProcessing,
    ideas,
    processingDocuments,
    handleProcessTranscript,
    isDocumentProcessing,
    setIdeas,
    updateProcessingDocuments
  };
};
