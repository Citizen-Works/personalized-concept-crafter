
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting a draft
 */
export const useDeleteDraft = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DraftsApi');

  const deleteDraftMutation = createMutation<boolean, { id: string, contentIdeaId: string }>(
    async ({ id, contentIdeaId }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("content_drafts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Security check
        
      if (error) throw error;
      
      return true;
    },
    'deleting draft',
    {
      successMessage: 'Content draft deleted successfully',
      errorMessage: 'Failed to delete content draft',
      onSuccess: (_, variables) => {
        invalidateQueries(['drafts', user?.id]);
        invalidateQueries(['drafts', 'idea', variables.contentIdeaId, user?.id]);
      }
    }
  );
  
  const deleteDraft = async (id: string, contentIdeaId: string): Promise<boolean> => {
    return deleteDraftMutation.mutateAsync({ id, contentIdeaId });
  };

  return {
    deleteDraft,
    deleteDraftMutation
  };
};
