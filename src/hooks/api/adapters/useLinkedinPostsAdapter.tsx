
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLinkedinPostsApi } from '../useLinkedinPostsApi';
import { LinkedinPost } from '@/types';
import { LinkedinPostCreateInput, LinkedinPostUpdateInput } from '../linkedin-posts/types';

/**
 * Adapter hook that provides the same interface as the original useLinkedinPosts hook
 * but uses the new standardized API pattern under the hood
 */
export const useLinkedinPostsAdapter = () => {
  const postsApi = useLinkedinPostsApi();
  
  // Get all LinkedIn posts query
  const postsQuery = useQuery({
    queryKey: ['linkedin-posts-adapter'],
    queryFn: () => postsApi.fetchLinkedinPosts()
  });
  
  // Create LinkedIn post mutation
  const addPostMutation = useMutation({
    mutationFn: (post: LinkedinPostCreateInput) => {
      return postsApi.createLinkedinPost(post);
    }
  });
  
  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: (params: { id: string, tag: string }) => {
      return postsApi.updateLinkedinPost(params.id, { tag: params.tag });
    }
  });
  
  // Delete LinkedIn post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => {
      return postsApi.deleteLinkedinPost(id);
    }
  });
  
  return {
    posts: postsQuery.data || [],
    isLoading: postsQuery.isLoading || postsApi.isLoading,
    isError: postsQuery.isError,
    addPost: addPostMutation.mutate,
    updateTag: updateTagMutation.mutate,
    deletePost: deletePostMutation.mutate
  };
};
