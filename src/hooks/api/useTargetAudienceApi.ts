
import { TargetAudienceApiResponse, TargetAudienceCreateInput, TargetAudienceUpdateInput } from './target-audience/types';
import { useFetchTargetAudience } from './target-audience/fetchOperations';
import { useTargetAudienceMutations } from './target-audience/mutationOperations';

/**
 * Hook for target audience API operations
 */
export const useTargetAudienceApi = (): TargetAudienceApiResponse => {
  const { 
    fetchTargetAudiences,
    fetchTargetAudienceById,
    selectedAudience,
    setSelectedAudience,
    isLoading: isFetchLoading
  } = useFetchTargetAudience();

  const {
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    isLoading: isMutationLoading
  } = useTargetAudienceMutations();

  return {
    fetchTargetAudiences,
    fetchTargetAudienceById,
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    selectedAudience,
    setSelectedAudience,
    isLoading: isFetchLoading || isMutationLoading
  };
};

// Re-export types for easier imports - using 'export type' for isolatedModules compatibility
export type { TargetAudienceCreateInput, TargetAudienceUpdateInput } from './target-audience/types';
