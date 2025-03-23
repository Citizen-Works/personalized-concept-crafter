
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNewsletterExamplesApi } from '../useNewsletterExamplesApi';
import { Document } from '@/types';
import { NewsletterExampleCreateInput, NewsletterExampleUpdateInput } from '../newsletter-examples/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useNewsletterExamples hook
 * but uses the new standardized API pattern under the hood
 */
export const useNewsletterExamplesAdapter = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const newsletterExamplesApi = useNewsletterExamplesApi();
  
  // Query for newsletter examples
  const {
    data: examples,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['newsletter-examples', user?.id],
    queryFn: () => newsletterExamplesApi.fetchNewsletterExamples(),
    enabled: !!user
  });

  // Mutation for adding a new example
  const addExampleMutation = useMutation({
    mutationFn: (example: NewsletterExampleCreateInput) => {
      return newsletterExamplesApi.createNewsletterExample(example);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-examples', user?.id] });
    }
  });

  // Mutation for deleting an example
  const deleteExampleMutation = useMutation({
    mutationFn: (id: string) => {
      return newsletterExamplesApi.deleteNewsletterExample(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-examples', user?.id] });
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
