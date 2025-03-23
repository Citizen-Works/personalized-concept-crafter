
import { ContentPillar } from '@/types';
import { useFetchContentPillars } from './content-pillars/fetchOperations';
import { useContentPillarMutations } from './content-pillars/mutationOperations';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from './content-pillars/types';

/**
 * Hook for standardized Content Pillars API operations
 */
export function useContentPillarsApi() {
  const { 
    fetchContentPillars, 
    fetchContentPillarById,
    isLoading: isFetchLoading 
  } = useFetchContentPillars();
  
  const { 
    createContentPillar, 
    updateContentPillar, 
    archiveContentPillar,
    incrementUsageCount,
    isLoading: isMutationLoading 
  } = useContentPillarMutations();
  
  return {
    // Query operations
    fetchContentPillars,
    fetchContentPillarById,
    
    // Mutation operations
    createContentPillar,
    updateContentPillar,
    archiveContentPillar,
    incrementUsageCount,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { ContentPillarCreateInput, ContentPillarUpdateInput };
