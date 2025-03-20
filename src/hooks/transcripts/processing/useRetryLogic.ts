
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const MAX_RETRY_ATTEMPTS = 3;

/**
 * Hook for managing retry logic for document processing
 */
export const useRetryLogic = (
  handleProcessDocument: (id: string, isRetry: boolean) => Promise<void>
) => {
  const [retryAttempts, setRetryAttempts] = useState<Record<string, number>>({});
  
  const getRetryCount = useCallback((documentId: string) => {
    return retryAttempts[documentId] || 0;
  }, [retryAttempts]);
  
  const handleSuccess = useCallback((documentId: string, title: string) => {
    // Reset retry counter on success
    if (retryAttempts[documentId]) {
      setRetryAttempts(prev => {
        const updated = { ...prev };
        delete updated[documentId];
        return updated;
      });
    }
    
    // Show success toast
    toast.success(
      `Ideas extracted from "${title}"`,
      {
        description: "New ideas can be found in your Review Queue",
        duration: 5000,
      }
    );
  }, [retryAttempts]);
  
  const handleRetry = useCallback((documentId: string, documentName: string): boolean => {
    const currentAttempts = retryAttempts[documentId] || 0;
    
    if (currentAttempts < MAX_RETRY_ATTEMPTS) {
      // Increment retry counter
      setRetryAttempts(prev => ({
        ...prev,
        [documentId]: currentAttempts + 1
      }));
      
      // Show retry toast
      const attemptNumber = currentAttempts + 1;
      toast.info(
        `Retrying idea extraction (${attemptNumber}/${MAX_RETRY_ATTEMPTS})`, 
        { 
          description: `Retry ${attemptNumber} for "${documentName}"`,
          duration: 3000
        }
      );
      
      // Execute retry
      setTimeout(() => {
        handleProcessDocument(documentId, true);
      }, 2000);
      
      return true;
    } else {
      // Max retries reached
      toast.error(
        `Failed to extract ideas after ${MAX_RETRY_ATTEMPTS} attempts`, 
        { 
          description: `Please try processing "${documentName}" again manually`,
          duration: 5000
        }
      );
      
      return false;
    }
  }, [retryAttempts, handleProcessDocument]);
  
  return {
    retryAttempts,
    handleRetry,
    handleSuccess,
    getRetryCount
  };
};
