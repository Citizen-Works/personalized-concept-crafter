
import { TargetAudience } from '@/types';
import { useFetchTargetAudiences } from './target-audience/fetchOperations';
import { useTargetAudienceMutations } from './target-audience/mutationOperations';
import { TargetAudienceCreateInput, TargetAudienceUpdateInput } from './target-audience/types';

/**
 * Hook for standardized Target Audience API operations
 */
export function useTargetAudienceApi() {
  const { 
    fetchTargetAudiences, 
    fetchTargetAudienceById
  } = useFetchTargetAudiences();
  
  const { 
    createTargetAudience, 
    updateTargetAudience, 
    archiveTargetAudience, 
    incrementUsageCount,
    isLoading 
  } = useTargetAudienceMutations();
  
  return {
    // Query operations
    fetchTargetAudiences,
    fetchTargetAudienceById,
    
    // Mutation operations
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    incrementUsageCount,
    
    // Loading state
    isLoading
  };
}

// Re-export types for convenience
export type { TargetAudienceCreateInput, TargetAudienceUpdateInput };
