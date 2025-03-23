
import { LinkedinPost } from '@/types';
import { useFetchLinkedinPosts } from './linkedin-posts/fetchOperations';
import { useLinkedinPostMutations } from './linkedin-posts/mutationOperations';
import { LinkedinPostCreateInput, LinkedinPostUpdateInput } from './linkedin-posts/types';

/**
 * Hook for standardized LinkedIn Posts API operations
 */
export function useLinkedinPostsApi() {
  const { 
    fetchLinkedinPosts, 
    fetchLinkedinPostById,
    isLoading: isFetchLoading 
  } = useFetchLinkedinPosts();
  
  const { 
    createLinkedinPost, 
    updateLinkedinPost, 
    deleteLinkedinPost,
    isLoading: isMutationLoading 
  } = useLinkedinPostMutations();
  
  return {
    // Query operations
    fetchLinkedinPosts,
    fetchLinkedinPostById,
    
    // Mutation operations
    createLinkedinPost,
    updateLinkedinPost,
    deleteLinkedinPost,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { LinkedinPostCreateInput, LinkedinPostUpdateInput };
