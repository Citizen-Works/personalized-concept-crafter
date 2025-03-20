
import { useState, useEffect, useCallback } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

export const useTranscriptProcessing = (documents = []) => {
  const navigate = useNavigate();
  const { processTranscript } = useDocuments();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDocuments, setProcessingDocuments] = useState<Set<string>>(new Set());
  const [ideas, setIdeas] = useState<IdeasResponse | string | null>(null);
  
  // Check for processing documents in local storage on initial load
  useEffect(() => {
    const storedProcessingDocs = localStorage.getItem('processingDocuments');
    if (storedProcessingDocs) {
      try {
        setProcessingDocuments(new Set(JSON.parse(storedProcessingDocs)));
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
    if (documents && documents.length > 0) {
      // Check if any documents have processing_status = 'processing'
      documents.forEach(doc => {
        if (doc.processing_status === 'processing') {
          setProcessingDocuments(prev => new Set([...prev, doc.id]));
        } else if (doc.processing_status === 'completed' || doc.processing_status === 'failed') {
          // Remove from processing list if completed or failed
          setProcessingDocuments(prev => {
            const next = new Set([...prev]);
            next.delete(doc.id);
            return next;
          });
          
          // Show completion toast if it was in the processing set
          if (processingDocuments.has(doc.id) && doc.processing_status === 'completed') {
            toast.success(`Ideas extracted from "${doc.title}"`, {
              duration: 5000,
              action: {
                label: "View Ideas",
                onClick: () => navigate('/ideas')
              }
            });
          }
        }
      });
    }
  }, [documents, processingDocuments, navigate]);

  const handleProcessTranscript = useCallback(async (id: string) => {
    try {
      // Mark as processing in UI
      setProcessingDocuments(prev => new Set([...prev, id]));
      
      // Start background processing
      toast.info("Starting idea extraction in the background. You can continue using the app.", {
        duration: 5000,
        description: "You'll be notified when it's complete."
      });
      
      // Process in background mode
      await processTranscript(id, true);
      
      // We don't show the results directly anymore, just notify the user
      toast.success("Transcript is being processed. You'll be notified when it's complete.", {
        duration: 5000,
        action: {
          label: "View Ideas",
          onClick: () => navigate('/ideas')
        }
      });
    } catch (error) {
      console.error("Failed to process transcript:", error);
      toast.error("Failed to start idea extraction");
      
      // Remove from processing list
      setProcessingDocuments(prev => {
        const next = new Set([...prev]);
        next.delete(id);
        return next;
      });
    }
  }, [processTranscript, navigate]);

  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    return processingDocuments.has(id) || (doc && doc.processing_status === 'processing');
  }, [processingDocuments, documents]);

  return {
    isProcessing,
    processingDocuments,
    ideas,
    handleProcessTranscript,
    isDocumentProcessing
  };
};
