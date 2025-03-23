
import { ContentPillar } from '@/types';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from './types';
import { useCreateContentPillar } from './createOperation';
import { useUpdateContentPillar } from './updateOperation';
import { useArchiveContentPillar } from './archiveOperation';
import { useIncrementContentPillarUsage } from './incrementUsageOperation';

/**
 * Hook for content pillar mutation operations
 */
export const useContentPillarMutations = () => {
  const { createContentPillar, createContentPillarMutation } = useCreateContentPillar();
  const { updateContentPillar, updateContentPillarMutation } = useUpdateContentPillar();
  const { archiveContentPillar, archiveContentPillarMutation } = useArchiveContentPillar();
  const { incrementUsageCount, incrementUsageCountMutation } = useIncrementContentPillarUsage();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createContentPillarMutation.isPending || 
    updateContentPillarMutation.isPending || 
    archiveContentPillarMutation.isPending ||
    incrementUsageCountMutation.isPending;

  return {
    createContentPillar,
    updateContentPillar,
    archiveContentPillar,
    incrementUsageCount,
    isLoading
  };
};
