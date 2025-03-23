
import { ContentDraft } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft } from './transformUtils';
import { DraftUpdateInput } from './types';

/**
 * Hook for updating an existing draft
 */
export const useUpdateDraft = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DraftsApi');

  const updateDraftMutation = createMutation<ContentDraft, { id: string } & DraftUpdateInput>(
    async (params) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { id, ...updates } = params;
      
      // Prepare the snake_case update data for Supabase
      const updateData: Record<string, any> = {};
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.contentType !== undefined) updateData.content_type = updates.contentType;
      if (updates.contentGoal !== undefined) updateData.content_goal = updates.contentGoal;
      if (updates.version !== undefined) updateData.version = updates.version;
      if (updates.feedback !== undefined) updateData.feedback = updates.feedback;
      if (updates.status !== undefined) updateData.status = updates.status;
      
      const { data, error } = await supabase
        .from("content_drafts")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToDraft(data);
    },
    'updating draft',
    {
      successMessage: 'Content draft updated successfully',
      errorMessage: 'Failed to update content draft',
      onSuccess: (draft) => {
        invalidateQueries(['drafts', user?.id]);
        invalidateQueries(['draft', draft.id, user?.id]);
        invalidateQueries(['drafts', 'idea', draft.contentIdeaId, user?.id]);
      }
    }
  );
  
  const updateDraft = async (params: { id: string } & DraftUpdateInput): Promise<ContentDraft> => {
    return updateDraftMutation.mutateAsync(params);
  };

  return {
    updateDraft,
    updateDraftMutation
  };
};
