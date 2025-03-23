
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting a draft
 */
export const useDeleteDraft = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DraftsApi');

  const deleteDraftMutation = createMutation<boolean, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data: draft, error: fetchError } = await supabase
        .from("content_drafts")
        .select("content_idea_id")
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .single();
        
      if (fetchError) throw fetchError;
      
      const contentIdeaId = draft.content_idea_id;
      
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
      onSuccess: (_, id) => {
        invalidateQueries(['drafts', user?.id]);
        // We don't know the contentIdeaId anymore after deletion, but we invalidate the draft query
        invalidateQueries(['draft', id, user?.id]);
      }
    }
  );
  
  const deleteDraft = async (id: string): Promise<boolean> => {
    return deleteDraftMutation.mutateAsync(id);
  };

  return {
    deleteDraft,
    deleteDraftMutation
  };
};
