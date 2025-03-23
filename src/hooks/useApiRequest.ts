
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useErrorHandling } from '@/hooks/useErrorHandling';

type ApiRequestOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  supressToast?: boolean;
};

/**
 * A reusable hook for making API requests with consistent error handling
 * and loading state management
 */
export function useApiRequest<TData = unknown>(componentName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const { handleError } = useErrorHandling(componentName);

  /**
   * Execute an API request with standardized error handling and loading state
   */
  const request = useCallback(
    async <T = TData>(
      requestFn: () => Promise<T>, 
      action: string,
      options: ApiRequestOptions<T> = {}
    ): Promise<T | null> => {
      const {
        onSuccess,
        onError,
        successMessage,
        loadingMessage,
        errorMessage,
        supressToast = false
      } = options;

      try {
        setIsLoading(true);
        
        if (loadingMessage && !supressToast) {
          toast.loading(loadingMessage);
        }
        
        const result = await requestFn();
        
        // Update state with the result
        setData(result as unknown as TData);
        
        // Show success message if provided
        if (successMessage && !supressToast) {
          toast.success(successMessage);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        // Use the error handling hook for consistent error handling
        const customErrorMessage = errorMessage || `Failed to ${action}`;
        handleError(error, action, 'error', { componentName });
        
        // Call onError callback if provided
        if (onError && error instanceof Error) {
          onError(error);
        }
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  return {
    request,
    isLoading,
    data,
    clearData: () => setData(null)
  };
}
