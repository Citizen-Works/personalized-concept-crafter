
import { WritingStyleProfile } from '@/types/writingStyle';
import { useFetchWritingStyle } from './writing-style/fetchOperations';
import { useWritingStyleMutations } from './writing-style/mutationOperations';
import { WritingStyleCreateInput, WritingStyleUpdateInput } from './writing-style/types';

/**
 * Hook for standardized Writing Style API operations
 */
export function useWritingStyleApi() {
  const { 
    fetchWritingStyleProfile, 
    fetchCustomPromptInstructions,
    isLoading: isFetchLoading 
  } = useFetchWritingStyle();
  
  const { 
    createWritingStyleProfile, 
    updateWritingStyleProfile,
    isLoading: isMutationLoading 
  } = useWritingStyleMutations();
  
  return {
    // Query operations
    fetchWritingStyleProfile,
    fetchCustomPromptInstructions,
    
    // Mutation operations
    createWritingStyleProfile,
    updateWritingStyleProfile,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { WritingStyleCreateInput, WritingStyleUpdateInput };
