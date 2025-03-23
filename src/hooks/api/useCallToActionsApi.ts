
import { CallToAction } from '@/types';
import { useFetchCallToActions } from './call-to-actions/fetchOperations';
import { useCallToActionMutations } from './call-to-actions/mutationOperations';
import { CallToActionCreateInput, CallToActionUpdateInput } from './call-to-actions/types';

/**
 * Hook for standardized Call To Actions API operations
 */
export function useCallToActionsApi() {
  const { 
    fetchCallToActions, 
    fetchCallToActionById,
    isLoading: isFetchLoading 
  } = useFetchCallToActions();
  
  const { 
    createCallToAction, 
    updateCallToAction, 
    archiveCallToAction,
    incrementUsageCount,
    isLoading: isMutationLoading 
  } = useCallToActionMutations();
  
  return {
    // Query operations
    fetchCallToActions,
    fetchCallToActionById,
    
    // Mutation operations
    createCallToAction,
    updateCallToAction,
    archiveCallToAction,
    incrementUsageCount,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { CallToActionCreateInput, CallToActionUpdateInput };
