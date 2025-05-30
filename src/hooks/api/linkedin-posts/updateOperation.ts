
import { LinkedinPost } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToLinkedinPost } from './transformUtils';
import { LinkedinPostUpdateInput } from './types';

/**
 * Hook for updating a LinkedIn post
 */
export const useUpdateLinkedinPost = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('LinkedinPostsApi');

  const updateLinkedinPostMutation = createMutation<LinkedinPost, { id: string; updates: LinkedinPostUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Convert any Date objects to ISO strings for Supabase
      const prepared = { ...updates };
      if (updates.publishedAt instanceof Date) {
        prepared.publishedAt = updates.publishedAt.toISOString();
      }
      
      // Supabase expects snake_case keys
      const { data, error } = await supabase
        .from("linkedin_posts")
        .update({
          content: prepared.content,
          url: prepared.url,
          tag: prepared.tag,
          published_at: prepared.publishedAt === null 
            ? null 
            : typeof prepared.publishedAt === 'string' 
              ? prepared.publishedAt 
              : null
        })
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToLinkedinPost(data);
    },
    'updating LinkedIn post',
    {
      successMessage: 'LinkedIn post updated successfully',
      errorMessage: 'Failed to update LinkedIn post',
      onSuccess: () => {
        invalidateQueries(['linkedinPosts', user?.id]);
        invalidateQueries(['linkedinPost', undefined, user?.id]);
      }
    }
  );
  
  const updateLinkedinPost = async (id: string, updates: LinkedinPostUpdateInput): Promise<LinkedinPost> => {
    return updateLinkedinPostMutation.mutateAsync({ id, updates });
  };

  return {
    updateLinkedinPost,
    updateLinkedinPostMutation
  };
};
