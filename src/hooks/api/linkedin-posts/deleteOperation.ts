
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting a LinkedIn post
 */
export const useDeleteLinkedinPost = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('LinkedinPostsApi');

  const deleteLinkedinPostMutation = createMutation<void, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("linkedin_posts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Security check
        
      if (error) throw error;
    },
    'deleting LinkedIn post',
    {
      successMessage: 'LinkedIn post deleted successfully',
      errorMessage: 'Failed to delete LinkedIn post',
      onSuccess: () => {
        // Update to use array for queryKey
        invalidateQueries([`linkedin-posts-${user?.id || 'anonymous'}`]);
      }
    }
  );
  
  const deleteLinkedinPost = async (id: string): Promise<void> => {
    return deleteLinkedinPostMutation.mutateAsync(id);
  };

  return {
    deleteLinkedinPost,
    deleteLinkedinPostMutation
  };
};
