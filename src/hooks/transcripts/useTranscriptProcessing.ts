
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Document } from '@/types';

// Interface for idea items returned from the API
export interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

// Interface for the structured ideas response
export interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useTranscriptProcessing = (documents: Document[] = []) => {
  const navigate = useNavigate();
  const { processTranscript } = useDocuments();
  
  // Use a single state update pattern to prevent multiple rerenders
  const [state, setState] = useState({
    isProcessing: false,
    processingDocuments: new Set<string>(),
    ideas: null as (IdeasResponse | string | null),
    retryAttempts: new Map<string, number>()
  });

  // Memoize these for direct access without causing rerenders when they're referenced
  const { isProcessing, processingDocuments, ideas, retryAttempts } = state;
  
  // Memoize the function that updates processingDocuments
  const updateProcessingDocuments = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setState(prevState => {
      const newProcessingDocs = updater(prevState.processingDocuments);
      return {
        ...prevState,
        processingDocuments: newProcessingDocs
      };
    });
    
    // Return the updated value for immediate use
    return updater(processingDocuments);
  }, [processingDocuments]);
  
  // Check for processing documents in local storage on initial load
  useEffect(() => {
    const storedProcessingDocs = localStorage.getItem('processingDocuments');
    if (storedProcessingDocs) {
      try {
        const parsedDocs = new Set<string>(JSON.parse(storedProcessingDocs));
        if (parsedDocs.size > 0) {
          setState(prev => ({
            ...prev,
            processingDocuments: parsedDocs
          }));
        }
      } catch (e) {
        console.error('Error parsing processing documents from localStorage:', e);
      }
    }
  }, []);

  // Update local storage when processing documents change
  useEffect(() => {
    if (processingDocuments.size > 0) {
      localStorage.setItem('processingDocuments', JSON.stringify([...processingDocuments]));
    } else {
      localStorage.removeItem('processingDocuments');
    }
  }, [processingDocuments]);
  
  // Update processing documents based on document status
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    
    let shouldUpdate = false;
    let updatedProcessingDocs = new Set<string>(processingDocuments);
    let updatedRetryAttempts = new Map<string, number>(retryAttempts);
    
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
          toast.success(`Ideas extracted from "${doc.title}"`, {
            duration: 5000,
            action: {
              label: "View Ideas",
              onClick: () => navigate('/ideas')
            }
          });
        } else if (doc.processing_status === 'failed') {
          // Auto-retry up to 2 times for failed processing
          const currentAttempts = retryAttempts.get(doc.id) || 0;
          
          if (currentAttempts < 2) {
            updatedRetryAttempts.set(doc.id, currentAttempts + 1);
            
            toast.error(`Processing failed for "${doc.title}". Retrying... (${currentAttempts + 1}/3)`, {
              duration: 3000
            });
            
            // Wait a moment before retrying
            setTimeout(() => {
              handleProcessTranscript(doc.id, true);
            }, 3000);
          } else {
            updatedRetryAttempts.delete(doc.id);
            
            toast.error(`Failed to extract ideas from "${doc.title}" after multiple attempts`, {
              duration: 5000,
              action: {
                label: "Try Again",
                onClick: () => {
                  handleProcessTranscript(doc.id);
                  setState(prev => ({
                    ...prev,
                    retryAttempts: new Map(prev.retryAttempts).set(doc.id, 0)
                  }));
                }
              }
            });
          }
        }
        
        shouldUpdate = true;
      }
    });
    
    // Only update state if anything changed
    if (shouldUpdate) {
      setState(prev => ({
        ...prev,
        processingDocuments: updatedProcessingDocs,
        retryAttempts: updatedRetryAttempts
      }));
    }
  }, [documents, processingDocuments, retryAttempts, navigate]);

  const handleProcessTranscript = useCallback(async (id: string, isRetry = false) => {
    try {
      // Mark as processing in UI
      updateProcessingDocuments(prev => {
        const updated = new Set<string>([...prev]);
        updated.add(id);
        return updated;
      });
      
      // Only show toast for initial processing, not retries
      if (!isRetry) {
        setState(prev => ({...prev, isProcessing: true}));
        
        toast.info("Starting idea extraction in the background. You can continue using the app.", {
          duration: 5000,
          description: "You'll be notified when it's complete."
        });
      }
      
      // Process in background mode
      await processTranscript(id, true);
      
      if (!isRetry) {
        toast.success("Transcript is being processed. You'll be notified when it's complete.", {
          duration: 5000,
          action: {
            label: "View Ideas",
            onClick: () => navigate('/ideas')
          }
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
        setState(prev => ({...prev, isProcessing: false}));
      }
    }
  }, [navigate, processTranscript, updateProcessingDocuments]);

  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    return processingDocuments.has(id) || (doc && doc.processing_status === 'processing');
  }, [processingDocuments, documents]);

  return useMemo(() => ({
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing,
    retryCount: (id: string) => retryAttempts.get(id) || 0
  }), [isProcessing, processingDocuments, ideas, handleProcessTranscript, isDocumentProcessing, retryAttempts]);
};
