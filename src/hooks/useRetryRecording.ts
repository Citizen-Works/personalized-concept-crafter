
import { useState, useCallback } from 'react';

interface UseRetryRecordingProps {
  resetRecording: () => void;
  startRecording: () => Promise<void>;
  setPermissionError: (value: boolean) => void;
}

export function useRetryRecording({
  resetRecording,
  startRecording,
  setPermissionError
}: UseRetryRecordingProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    resetRecording();
    setPermissionError(false);
    
    // Add a small delay before starting again
    setTimeout(() => {
      startRecording()
        .then(() => {
          setIsRetrying(false);
        })
        .catch((error) => {
          setIsRetrying(false);
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setPermissionError(true);
          }
        });
    }, 500);
  }, [resetRecording, startRecording, setPermissionError]);

  return {
    isRetrying,
    handleRetry
  };
}
