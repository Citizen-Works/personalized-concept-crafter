
import { TargetAudience } from '@/types';
import { TargetAudienceCreateInput, TargetAudienceUpdateInput } from './types';
import { useCreateTargetAudience } from './createOperation';
import { useUpdateTargetAudience } from './updateOperation';
import { useArchiveTargetAudience } from './archiveOperation';
import { useIncrementTargetAudienceUsage } from './incrementUsageOperation';

/**
 * Hook for target audience mutation operations
 */
export const useTargetAudienceMutations = () => {
  const { createTargetAudience, createTargetAudienceMutation } = useCreateTargetAudience();
  const { updateTargetAudience, updateTargetAudienceMutation } = useUpdateTargetAudience();
  const { archiveTargetAudience, archiveTargetAudienceMutation } = useArchiveTargetAudience();
  const { incrementUsageCount, incrementUsageCountMutation } = useIncrementTargetAudienceUsage();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createTargetAudienceMutation.isPending || 
    updateTargetAudienceMutation.isPending || 
    archiveTargetAudienceMutation.isPending ||
    incrementUsageCountMutation.isPending;

  return {
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    incrementUsageCount,
    isLoading
  };
};
