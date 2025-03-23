
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLinkedinPostsApi } from '../useLinkedinPostsApi';
import { LinkedinPost } from '@/types';
import { LinkedinPostCreateInput, LinkedinPostUpdateInput } from '../linkedin-posts/types';

/**
 * Adapter hook that provides the same interface as the original useLinkedinPosts hook
 * but uses the new standardized API pattern under the hood
 */
export const useLinkedinPostsAdapter = () => {
  const postsApi = useLinkedinPostsApi();
  const queryClient = useQueryClient();
  
  // Get all LinkedIn posts query
  const postsQuery = useQuery({
    queryKey: ['linkedin-posts-adapter'],
    queryFn: () => postsApi.fetchLinkedinPosts(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Create LinkedIn post mutation
  const addPostMutation = useMutation({
    mutationFn: (post: LinkedinPostCreateInput) => {
      return postsApi.createLinkedinPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts-adapter'] });
    }
  });
  
  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: (params: { id: string, tag: string }) => {
      return postsApi.updateLinkedinPost(params.id, { tag: params.tag });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts-adapter'] });
    }
  });
  
  // Delete LinkedIn post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => {
      return postsApi.deleteLinkedinPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts-adapter'] });
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
