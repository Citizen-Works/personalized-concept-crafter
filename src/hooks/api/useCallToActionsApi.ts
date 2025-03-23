
import { CallToActionApiResponse, CallToActionCreateInput, CallToActionUpdateInput } from './call-to-actions/types';
import { useFetchCallToActions } from './call-to-actions/fetchOperations';
import { useCallToActionMutations } from './call-to-actions/mutationOperations';

/**
 * Hook for call to action API operations
 */
export const useCallToActionsApi = (): CallToActionApiResponse => {
  const { 
    fetchCallToActions,
    fetchCallToActionById,
    selectedCallToAction,
    setSelectedCallToAction,
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
    fetchCallToActions,
    fetchCallToActionById,
    createCallToAction,
    updateCallToAction,
    archiveCallToAction,
    incrementUsageCount,
    selectedCallToAction,
    setSelectedCallToAction,
    isLoading: isFetchLoading || isMutationLoading
  };
};

// Re-export types for easier imports
export type { CallToActionCreateInput, CallToActionUpdateInput } from './call-to-actions/types';
