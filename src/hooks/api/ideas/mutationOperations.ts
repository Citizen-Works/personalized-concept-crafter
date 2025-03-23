
import { ContentIdea } from '@/types';
import { useCreateIdea } from './createOperation';
import { useUpdateIdea } from './updateOperation';
import { useDeleteIdea } from './deleteOperation';

/**
 * Hook for idea mutation operations
 */
export const useIdeaMutations = () => {
  const { createIdea, createIdeaMutation } = useCreateIdea();
  const { updateIdea, updateIdeaMutation } = useUpdateIdea();
  const { deleteIdea, deleteIdeaMutation } = useDeleteIdea();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createIdeaMutation.isPending || 
    updateIdeaMutation.isPending || 
    deleteIdeaMutation.isPending;

  return {
    createIdea,
    updateIdea,
    deleteIdea,
    isLoading
  };
};
