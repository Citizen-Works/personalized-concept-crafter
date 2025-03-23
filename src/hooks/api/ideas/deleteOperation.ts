
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { ContentStatus } from '@/types';

/**
 * Hook for deleting (rejecting) an idea
 */
export const useDeleteIdea = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('IdeasApi');

  const deleteIdeaMutation = createMutation<boolean, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Update the idea status to 'rejected' instead of deleting
      const { error } = await supabase
        .from("content_ideas")
        .update({ status: 'rejected' as ContentStatus })
        .eq("id", id)
        .eq("user_id", user.id); // Security check
        
      if (error) throw error;
      
      // We could implement the cleanup of old rejected ideas here, but for simplicity,
      // we're just marking as rejected in this implementation
      
      return true;
    },
    'rejecting idea',
    {
      successMessage: 'Content idea rejected successfully',
      errorMessage: 'Failed to reject content idea',
      onSuccess: () => {
        invalidateQueries(['ideas', user?.id]);
      }
    }
  );
  
  const deleteIdea = async (id: string): Promise<boolean> => {
    return deleteIdeaMutation.mutateAsync(id);
  };

  return {
    deleteIdea,
    deleteIdeaMutation
  };
};
