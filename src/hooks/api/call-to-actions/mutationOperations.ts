
import { CallToAction } from '@/types';
import { CallToActionCreateInput, CallToActionUpdateInput } from './types';
import { useCreateCallToAction } from './createOperation';
import { useUpdateCallToAction } from './updateOperation';
import { useArchiveCallToAction } from './archiveOperation';
import { useIncrementCallToActionUsage } from './incrementUsageOperation';

/**
 * Hook for call to action mutation operations
 */
export const useCallToActionMutations = () => {
  const { createCallToAction, createCallToActionMutation } = useCreateCallToAction();
  const { updateCallToAction, updateCallToActionMutation } = useUpdateCallToAction();
  const { archiveCallToAction, archiveCallToActionMutation } = useArchiveCallToAction();
  const { incrementUsageCount, incrementUsageCountMutation } = useIncrementCallToActionUsage();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createCallToActionMutation.isPending || 
    updateCallToActionMutation.isPending || 
    archiveCallToActionMutation.isPending || 
    incrementUsageCountMutation.isPending;

  return {
    createCallToAction,
    updateCallToAction,
    archiveCallToAction,
    incrementUsageCount,
    isLoading
  };
};
