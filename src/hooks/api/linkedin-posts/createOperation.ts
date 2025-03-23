
import { LinkedinPost } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToLinkedinPost } from './transformUtils';
import { LinkedinPostCreateInput } from './types';

/**
 * Hook for creating a new LinkedIn post
 */
export const useCreateLinkedinPost = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('LinkedinPostsApi');

  const createLinkedinPostMutation = createMutation<LinkedinPost, LinkedinPostCreateInput>(
    async (post) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("linkedin_posts")
        .insert([
          {
            content: post.content,
            url: post.url || null,
            tag: post.tag || 'My post',
            user_id: user.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToLinkedinPost(data);
    },
    'creating LinkedIn post',
    {
      successMessage: 'LinkedIn post created successfully',
      errorMessage: 'Failed to create LinkedIn post',
      onSuccess: () => {
        invalidateQueries(['linkedin-posts', user?.id]);
      }
    }
  );
  
  const createLinkedinPost = async (post: LinkedinPostCreateInput): Promise<LinkedinPost> => {
    return createLinkedinPostMutation.mutateAsync(post);
  };

  return {
    createLinkedinPost,
    createLinkedinPostMutation
  };
};
