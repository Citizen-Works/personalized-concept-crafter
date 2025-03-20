
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for managing retry attempts for failed processing
 */
export const useRetryLogic = (handleProcessTranscript: (id: string, isRetry: boolean) => Promise<void>) => {
  const navigate = useNavigate();
  const [retryAttempts, setRetryAttempts] = useState<Map<string, number>>(new Map<string, number>());
  
  const updateRetryCount = useCallback((documentId: string, increment: boolean = true) => {
    setRetryAttempts(prev => {
      const newMap = new Map<string, number>(prev);
      
      if (increment) {
        const currentCount = prev.get(documentId) || 0;
        newMap.set(documentId, currentCount + 1);
      } else {
        newMap.delete(documentId);
      }
      
      return newMap;
    });
  }, []);
  
  const handleRetry = useCallback((documentId: string, documentTitle: string) => {
    const currentAttempts = retryAttempts.get(documentId) || 0;
    
    if (currentAttempts < 2) {
      updateRetryCount(documentId);
      
      toast.error(`Processing failed for "${documentTitle}". Retrying... (${currentAttempts + 1}/3)`, {
        duration: 3000
      });
      
      // Wait a moment before retrying
      setTimeout(() => {
        handleProcessTranscript(documentId, true);
      }, 3000);
      
      return true;
    } else {
      // Reset retry counter
      updateRetryCount(documentId, false);
      
      toast.error(`Failed to extract ideas from "${documentTitle}" after multiple attempts`, {
        duration: 5000,
        action: {
          label: "Try Again",
          onClick: () => {
            handleProcessTranscript(documentId);
            updateRetryCount(documentId, false); // Reset counter for manual retry
          }
        }
      });
      
      return false;
    }
  }, [retryAttempts, handleProcessTranscript, updateRetryCount]);
  
  const handleSuccess = useCallback((documentId: string, documentTitle: string) => {
    // Reset retry counter on success
    updateRetryCount(documentId, false);
    
    toast.success(`Ideas extracted from "${documentTitle}"`, {
      duration: 5000,
      action: {
        label: "View Ideas",
        onClick: () => navigate('/ideas')
      }
    });
  }, [navigate, updateRetryCount]);
  
  return {
    retryAttempts,
    handleRetry,
    handleSuccess,
    getRetryCount: (id: string) => retryAttempts.get(id) || 0
  };
};
