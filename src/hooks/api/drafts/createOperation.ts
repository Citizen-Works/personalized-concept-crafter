
import { ContentDraft } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft } from './transformUtils';
import { DraftCreateInput } from './types';

/**
 * Hook for creating a new draft
 */
export const useCreateDraft = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DraftsApi');

  const createDraftMutation = createMutation<ContentDraft, DraftCreateInput>(
    async (draft) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case input for Supabase
      const snakeCaseInput = {
        content_idea_id: draft.contentIdeaId,
        content: draft.content,
        content_type: draft.contentType || 'linkedin',
        content_goal: draft.contentGoal,
        version: draft.version,
        feedback: draft.feedback || '',
        status: draft.status,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("content_drafts")
        .insert([snakeCaseInput])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToDraft(data);
    },
    'creating draft',
    {
      successMessage: 'Content draft created successfully',
      errorMessage: 'Failed to create content draft',
      onSuccess: (draft) => {
        invalidateQueries(['drafts', user?.id]);
        invalidateQueries(['drafts', 'idea', draft.contentIdeaId, user?.id]);
      }
    }
  );
  
  const createDraft = async (input: DraftCreateInput): Promise<ContentDraft> => {
    return createDraftMutation.mutateAsync(input);
  };

  return {
    createDraft,
    createDraftMutation
  };
};
