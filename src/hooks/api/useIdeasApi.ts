
import { ContentIdea } from '@/types';
import { useFetchIdeas } from './ideas/fetchOperations';
import { useIdeaMutations } from './ideas/mutationOperations';
import { IdeaCreateInput, IdeaUpdateInput } from './ideas/types';

/**
 * Hook for standardized Content Ideas API operations
 */
export function useIdeasApi() {
  const { 
    fetchIdeas, 
    fetchIdeaById,
    isLoading: isFetchLoading 
  } = useFetchIdeas();
  
  const { 
    createIdea, 
    updateIdea, 
    deleteIdea,
    isLoading: isMutationLoading 
  } = useIdeaMutations();
  
  return {
    // Query operations
    fetchIdeas,
    fetchIdeaById,
    
    // Mutation operations
    createIdea,
    updateIdea,
    deleteIdea,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { IdeaCreateInput, IdeaUpdateInput };
