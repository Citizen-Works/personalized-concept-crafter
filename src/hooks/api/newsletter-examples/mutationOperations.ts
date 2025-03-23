
import { useCreateNewsletterExample } from './createOperation';
import { useUpdateNewsletterExample } from './updateOperation';
import { useDeleteNewsletterExample } from './deleteOperation';

/**
 * Hook for newsletter examples mutation operations
 */
export const useNewsletterExampleMutations = () => {
  const { createNewsletterExample, createNewsletterExampleMutation } = useCreateNewsletterExample();
  const { updateNewsletterExample, updateNewsletterExampleMutation } = useUpdateNewsletterExample();
  const { deleteNewsletterExample, deleteNewsletterExampleMutation } = useDeleteNewsletterExample();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createNewsletterExampleMutation.isPending || 
    updateNewsletterExampleMutation.isPending || 
    deleteNewsletterExampleMutation.isPending;

  return {
    createNewsletterExample,
    updateNewsletterExample,
    deleteNewsletterExample,
    isLoading
  };
};
