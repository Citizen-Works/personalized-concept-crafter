
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMarketingExamplesApi } from '../useMarketingExamplesApi';
import { Document } from '@/types';
import { MarketingExampleCreateInput, MarketingExampleUpdateInput } from '../marketing-examples/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useMarketingExamples hook
 * but uses the new standardized API pattern under the hood
 */
export const useMarketingExamplesAdapter = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const marketingExamplesApi = useMarketingExamplesApi();
  
  // Query for marketing examples
  const {
    data: examples,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['marketing-examples', user?.id],
    queryFn: () => marketingExamplesApi.fetchMarketingExamples(),
    enabled: !!user
  });

  // Mutation for adding a new example
  const addExampleMutation = useMutation({
    mutationFn: (example: MarketingExampleCreateInput) => {
      return marketingExamplesApi.createMarketingExample(example);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-examples', user?.id] });
    }
  });

  // Mutation for deleting an example
  const deleteExampleMutation = useMutation({
    mutationFn: (id: string) => {
      return marketingExamplesApi.deleteMarketingExample(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-examples', user?.id] });
    }
  });

  return {
    examples: examples || [],
    isLoading,
    isError,
    addExample: addExampleMutation.mutate,
    deleteExample: deleteExampleMutation.mutate
  };
};
