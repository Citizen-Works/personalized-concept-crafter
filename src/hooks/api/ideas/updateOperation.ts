
import { ContentIdea } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentIdea } from './transformUtils';
import { IdeaUpdateInput } from './types';

/**
 * Hook for updating an existing idea
 */
export const useUpdateIdea = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('IdeasApi');

  const updateIdeaMutation = createMutation<ContentIdea, { id: string } & IdeaUpdateInput>(
    async ({ id, ...updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case update data for Supabase
      const updateData: Record<string, any> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.meetingTranscriptExcerpt !== undefined) updateData.meeting_transcript_excerpt = updates.meetingTranscriptExcerpt;
      if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.hasBeenUsed !== undefined) updateData.has_been_used = updates.hasBeenUsed;
      if (updates.contentPillarIds !== undefined) updateData.content_pillar_ids = updates.contentPillarIds;
      if (updates.targetAudienceIds !== undefined) updateData.target_audience_ids = updates.targetAudienceIds;
      
      const { data, error } = await supabase
        .from("content_ideas")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToContentIdea(data);
    },
    'updating idea',
    {
      successMessage: 'Content idea updated successfully',
      errorMessage: 'Failed to update content idea',
      onSuccess: (_, variables) => {
        invalidateQueries(['ideas', user?.id]);
        invalidateQueries(['idea', variables.id, user?.id]);
      }
    }
  );
  
  const updateIdea = async (params: { id: string } & IdeaUpdateInput): Promise<ContentIdea> => {
    return updateIdeaMutation.mutateAsync(params);
  };

  return {
    updateIdea,
    updateIdeaMutation
  };
};
