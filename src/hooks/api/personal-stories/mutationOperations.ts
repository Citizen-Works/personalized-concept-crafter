
import { PersonalStory } from '@/types';
import { PersonalStoryCreateInput, PersonalStoryUpdateInput } from './types';
import { useCreatePersonalStory } from './createOperation';
import { useUpdatePersonalStory } from './updateOperation';
import { useArchivePersonalStory } from './archiveOperation';
import { useIncrementUsageCount } from './incrementUsageOperation';

/**
 * Hook for personal story mutation operations
 */
export const usePersonalStoryMutations = () => {
  const { createPersonalStory, createPersonalStoryMutation } = useCreatePersonalStory();
  const { updatePersonalStory, updatePersonalStoryMutation } = useUpdatePersonalStory();
  const { archivePersonalStory, archivePersonalStoryMutation } = useArchivePersonalStory();
  const { incrementUsageCount, incrementUsageCountMutation } = useIncrementUsageCount();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createPersonalStoryMutation.isPending || 
    updatePersonalStoryMutation.isPending || 
    archivePersonalStoryMutation.isPending ||
    incrementUsageCountMutation.isPending;

  return {
    createPersonalStory,
    updatePersonalStory,
    archivePersonalStory,
    incrementUsageCount,
    isLoading
  };
};
