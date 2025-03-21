
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';

interface ErrorMetadata {
  componentName?: string;
  action?: string;
  tenantId?: string;
  requestId?: string;
  timestamp?: string;
}

// Type definition for different error severities
type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * A hook that provides consistent error handling across the application
 * with tenant-aware error logging capabilities
 */
export const useErrorHandling = (componentName: string) => {
  const { user } = useAuth();
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Handles errors with consistent UI feedback and optional logging
   */
  const handleError = useCallback((
    error: unknown, 
    action: string,
    severity: ErrorSeverity = 'error',
    metadata: Partial<ErrorMetadata> = {}
  ) => {
    // Extract error message with fallbacks
    const errorObj = error instanceof Error ? error : new Error(
      typeof error === 'string' ? error : 'An unknown error occurred'
    );
    
    // Store the error for potential debugging or reporting
    setLastError(errorObj);
    
    // Combine base metadata with provided metadata
    const fullMetadata: ErrorMetadata = {
      componentName,
      action,
      tenantId: user?.email?.split('@')[1] || undefined, // Simple tenant extraction from email domain
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // Log error with metadata for debugging
    console.error(
      `Error in ${componentName} during ${action}:`, 
      errorObj, 
      fullMetadata
    );

    // Provide user feedback based on severity
    const errorMessage = errorObj.message || 'An unexpected error occurred.';
    
    switch (severity) {
      case 'error':
        toast.error(`${action} failed: ${errorMessage}`);
        break;
      case 'warning':
        toast.warning(errorMessage);
        break;
      case 'info':
        toast.info(errorMessage);
        break;
    }

    // Return for chain handling
    return errorObj;
  }, [componentName, user]);

  /**
   * Wraps an async function with error handling
   */
  const withErrorHandling = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    action: string,
    severity: ErrorSeverity = 'error'
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, action, severity);
        return undefined;
      }
    };
  }, [handleError]);

  return { 
    handleError,
    withErrorHandling,
    lastError,
    clearLastError: () => setLastError(null)
  };
};
