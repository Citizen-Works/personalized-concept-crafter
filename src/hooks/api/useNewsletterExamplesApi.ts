
import { NewsletterExampleApiResponse, NewsletterExampleCreateInput, NewsletterExampleUpdateInput } from './newsletter-examples/types';
import { useFetchNewsletterExamples } from './newsletter-examples/fetchOperations';
import { useNewsletterExampleMutations } from './newsletter-examples/mutationOperations';

/**
 * Hook for newsletter examples API operations
 */
export const useNewsletterExamplesApi = (): NewsletterExampleApiResponse => {
  const { 
    fetchNewsletterExamples,
    fetchNewsletterExampleById,
    isLoading: isFetchLoading 
  } = useFetchNewsletterExamples();

  const {
    createNewsletterExample,
    updateNewsletterExample,
    deleteNewsletterExample,
    isLoading: isMutationLoading
  } = useNewsletterExampleMutations();

  return {
    fetchNewsletterExamples,
    fetchNewsletterExampleById,
    createNewsletterExample,
    updateNewsletterExample,
    deleteNewsletterExample,
    isLoading: isFetchLoading || isMutationLoading
  };
};

export type { NewsletterExampleCreateInput, NewsletterExampleUpdateInput } from './newsletter-examples/types';
