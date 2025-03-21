
import { useState, useCallback, useEffect } from 'react';
import { Document } from '@/types';
import { toast } from 'sonner';
import { useProcessingStorage } from './useProcessingStorage';

const MAX_PROCESSING_TIME = 5 * 60 * 1000; // 5 minutes maximum processing time

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
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, number>>({});
  
  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    return processingDocuments.has(id) || (doc && doc.processing_status === 'processing');
  }, [processingDocuments, documents]);
  
  // Clear timeout for a specific document
  const clearDocumentTimeout = useCallback((docId: string) => {
    if (processingTimeouts[docId]) {
      window.clearTimeout(processingTimeouts[docId]);
      setProcessingTimeouts(prev => {
        const updated = { ...prev };
        delete updated[docId];
        return updated;
      });
    }
  }, [processingTimeouts]);
  
  // Setup timeout monitoring for processing documents
  useEffect(() => {
    // Setup timeouts for documents that don't have them yet
    processingDocuments.forEach(docId => {
      if (!processingTimeouts[docId]) {
        const timeoutId = window.setTimeout(() => {
          // If still processing after timeout, auto-cancel
          if (processingDocuments.has(docId)) {
            toast.error("Processing timed out", {
              description: "The document processing took too long and was canceled"
            });
            
            updateProcessingDocuments(prev => {
              const updated = new Set<string>([...prev]);
              updated.delete(docId);
              return updated;
            });
          }
          
          // Clear this timeout from state
          setProcessingTimeouts(prev => {
            const updated = { ...prev };
            delete updated[docId];
            return updated;
          });
        }, MAX_PROCESSING_TIME);
        
        // Store the timeout ID
        setProcessingTimeouts(prev => ({
          ...prev,
          [docId]: timeoutId
        }));
      }
    });
    
    // Cleanup timeouts for documents no longer processing
    Object.keys(processingTimeouts).forEach(docId => {
      if (!processingDocuments.has(docId)) {
        clearDocumentTimeout(docId);
      }
    });
    
    // Cleanup on unmount
    return () => {
      Object.values(processingTimeouts).forEach(timeoutId => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [processingDocuments, processingTimeouts, clearDocumentTimeout, updateProcessingDocuments]);
  
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
  
  // Cancel processing for a specific document
  const cancelProcessing = useCallback((docId: string) => {
    if (processingDocuments.has(docId)) {
      clearDocumentTimeout(docId);
      
      // Update the document status in Supabase to "idle"
      try {
        const { supabase } = require('@/integrations/supabase/client');
        supabase
          .from("documents")
          .update({ processing_status: 'idle' })
          .eq("id", docId)
          .then(() => {
            // After updating the status, remove from processing list
            updateProcessingDocuments(prev => {
              const updated = new Set<string>([...prev]);
              updated.delete(docId);
              return updated;
            });
            
            toast.info("Processing canceled", {
              description: "Document processing has been canceled"
            });
          })
          .catch(error => {
            console.error("Error updating document status:", error);
            toast.error("Error canceling processing");
          });
      } catch (error) {
        console.error("Error in cancelProcessing:", error);
        
        // If there's an error with Supabase, still remove from processing list
        updateProcessingDocuments(prev => {
          const updated = new Set<string>([...prev]);
          updated.delete(docId);
          return updated;
        });
        
        toast.info("Processing canceled locally", {
          description: "Document processing state has been reset"
        });
      }
    }
  }, [processingDocuments, clearDocumentTimeout, updateProcessingDocuments]);
  
  return {
    isProcessing,
    ideas,
    processingDocuments,
    handleProcessTranscript,
    isDocumentProcessing,
    setIdeas,
    updateProcessingDocuments,
    cancelProcessing
  };
};
