
import { useCallback } from 'react';
import { 
  useMutation, 
  useQuery, 
  UseMutationOptions, 
  UseQueryOptions,
  QueryClient,
  useQueryClient
} from '@tanstack/react-query';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { toast } from 'sonner';

// Define a type for API operation options
export interface ApiOptions {
  successMessage?: string;
  errorMessage?: string;
  suppressToast?: boolean;
}

/**
 * A hook that wraps Tanstack Query with standardized error handling
 * and toast notifications for a consistent API experience
 */
export function useTanstackApiQuery(componentName: string) {
  const { handleError } = useErrorHandling(componentName);
  const queryClient = useQueryClient();

  /**
   * Creates a wrapped query function with error handling
   */
  const createQuery = useCallback(<TData, TError = Error>(
    queryFn: () => Promise<TData>,
    action: string,
    options?: UseQueryOptions<TData, TError> & ApiOptions
  ) => {
    const { 
      successMessage, 
      errorMessage, 
      suppressToast = false,
      ...queryOptions 
    } = options || {};

    // Create a final options object with required queryKey
    const finalOptions: UseQueryOptions<TData, TError> = {
      ...(queryOptions as UseQueryOptions<TData, TError>)
    };
    
    if (!finalOptions.queryKey) {
      console.warn(`No queryKey provided for query: ${action}. Using fallback key.`);
      finalOptions.queryKey = [`${componentName}-${action}`];
    }

    // Wrap the queryFn to handle errors
    const wrappedQueryFn = async () => {
      try {
        return await queryFn();
      } catch (error) {
        // Handle the error and propagate it for React Query
        handleError(
          error, 
          action, 
          'error', 
          { componentName }
        );
        throw error;
      }
    };

    // Use Tanstack's useQuery with our wrapped function
    return useQuery<TData, TError>({
      ...finalOptions,
      queryFn: wrappedQueryFn,
      onError: (error) => {
        if (!suppressToast) {
          const message = errorMessage || `Failed to ${action}`;
          toast.error(message);
        }
        
        // Call the original onError if it exists
        if (queryOptions.onError) {
          queryOptions.onError(error);
        }
      }
    });
  }, [handleError, componentName]);

  /**
   * Creates a wrapped mutation function with error handling
   */
  const createMutation = useCallback(<TData, TVariables, TError = Error>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    action: string,
    options?: UseMutationOptions<TData, TError, TVariables> & ApiOptions
  ) => {
    const { 
      successMessage, 
      errorMessage, 
      suppressToast = false,
      ...mutationOptions 
    } = options || {};

    return useMutation<TData, TError, TVariables>({
      ...mutationOptions,
      mutationFn: async (variables) => {
        try {
          const result = await mutationFn(variables);
          
          if (!suppressToast && successMessage) {
            toast.success(successMessage);
          }
          
          return result;
        } catch (error) {
          // Handle the error and propagate it for React Query
          handleError(
            error, 
            action, 
            'error', 
            { componentName }
          );
          throw error;
        }
      },
      onError: (error, variables, context) => {
        if (!suppressToast) {
          const message = errorMessage || `Failed to ${action}`;
          toast.error(message);
        }
        
        // Call the original onError if it exists
        if (mutationOptions?.onError) {
          mutationOptions.onError(error, variables, context);
        }
      }
    });
  }, [handleError, componentName]);

  /**
   * Utility function to invalidate queries
   */
  const invalidateQueries = useCallback((queryKey: unknown[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  return {
    createQuery,
    createMutation,
    queryClient,
    invalidateQueries
  };
}
