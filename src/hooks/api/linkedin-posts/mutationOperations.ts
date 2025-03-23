
import { useCreateLinkedinPost } from './createOperation';
import { useUpdateLinkedinPost } from './updateOperation';
import { useDeleteLinkedinPost } from './deleteOperation';

/**
 * Hook for LinkedIn posts mutation operations
 */
export const useLinkedinPostMutations = () => {
  const { createLinkedinPost, createLinkedinPostMutation } = useCreateLinkedinPost();
  const { updateLinkedinPost, updateLinkedinPostMutation } = useUpdateLinkedinPost();
  const { deleteLinkedinPost, deleteLinkedinPostMutation } = useDeleteLinkedinPost();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createLinkedinPostMutation.isPending || 
    updateLinkedinPostMutation.isPending || 
    deleteLinkedinPostMutation.isPending;

  return {
    createLinkedinPost,
    updateLinkedinPost,
    deleteLinkedinPost,
    isLoading
  };
};
