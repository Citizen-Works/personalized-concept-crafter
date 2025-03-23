
import { ContentPillarApiResponse, ContentPillarCreateInput, ContentPillarUpdateInput } from './content-pillars/types';
import { useFetchContentPillars } from './content-pillars/fetchOperations';
import { useContentPillarMutations } from './content-pillars/mutationOperations';

/**
 * Hook for content pillar API operations
 */
export const useContentPillarsApi = (): ContentPillarApiResponse => {
  const { 
    fetchContentPillars,
    fetchContentPillarById,
    selectedPillar,
    setSelectedPillar,
    isLoading: isFetchLoading
  } = useFetchContentPillars();

  const {
    createContentPillar,
    updateContentPillar,
    archiveContentPillar,
    isLoading: isMutationLoading
  } = useContentPillarMutations();

  return {
    fetchContentPillars,
    fetchContentPillarById,
    createContentPillar,
    updateContentPillar,
    archiveContentPillar,
    selectedPillar,
    setSelectedPillar,
    isLoading: isFetchLoading || isMutationLoading
  };
};

// Re-export types for easier imports
export type { ContentPillarCreateInput, ContentPillarUpdateInput } from './content-pillars/types';
