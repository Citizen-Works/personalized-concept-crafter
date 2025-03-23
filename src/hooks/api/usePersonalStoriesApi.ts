
import { PersonalStory } from '@/types';
import { useFetchPersonalStories } from './personal-stories/fetchOperations';
import { usePersonalStoryMutations } from './personal-stories/mutationOperations';
import { PersonalStoryCreateInput, PersonalStoryUpdateInput } from './personal-stories/types';

/**
 * Hook for standardized Personal Stories API operations
 */
export function usePersonalStoriesApi() {
  const { 
    fetchPersonalStories, 
    fetchPersonalStoryById,
    fetchPersonalStoriesByTag,
    isLoading: isFetchLoading 
  } = useFetchPersonalStories();
  
  const { 
    createPersonalStory, 
    updatePersonalStory, 
    archivePersonalStory,
    incrementUsageCount,
    isLoading: isMutationLoading 
  } = usePersonalStoryMutations();
  
  return {
    // Query operations
    fetchPersonalStories,
    fetchPersonalStoryById,
    fetchPersonalStoriesByTag,
    
    // Mutation operations
    createPersonalStory,
    updatePersonalStory,
    archivePersonalStory,
    incrementUsageCount,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { PersonalStoryCreateInput, PersonalStoryUpdateInput };
