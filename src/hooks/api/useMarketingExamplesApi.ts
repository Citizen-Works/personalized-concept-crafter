
import { MarketingExampleApiResponse, MarketingExampleCreateInput, MarketingExampleUpdateInput } from './marketing-examples/types';
import { useFetchMarketingExamples } from './marketing-examples/fetchOperations';
import { useMarketingExampleMutations } from './marketing-examples/mutationOperations';

/**
 * Hook for marketing examples API operations
 */
export const useMarketingExamplesApi = (): MarketingExampleApiResponse => {
  const { 
    fetchMarketingExamples,
    fetchMarketingExampleById,
    isLoading: isFetchLoading 
  } = useFetchMarketingExamples();

  const {
    createMarketingExample,
    updateMarketingExample,
    deleteMarketingExample,
    isLoading: isMutationLoading
  } = useMarketingExampleMutations();

  return {
    fetchMarketingExamples,
    fetchMarketingExampleById,
    createMarketingExample,
    updateMarketingExample,
    deleteMarketingExample,
    isLoading: isFetchLoading || isMutationLoading
  };
};

export type { MarketingExampleCreateInput, MarketingExampleUpdateInput } from './marketing-examples/types';
