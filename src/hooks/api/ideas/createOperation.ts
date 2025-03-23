
import { ContentIdea } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentIdea } from './transformUtils';
import { IdeaCreateInput } from './types';

/**
 * Hook for creating a new idea
 */
export const useCreateIdea = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('IdeasApi');

  const createIdeaMutation = createMutation<ContentIdea, IdeaCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Convert camelCase to snake_case for the database
      const ideaData = {
        user_id: user.id,
        title: input.title,
        description: input.description || null,
        notes: input.notes || null,
        source: input.source,
        meeting_transcript_excerpt: input.meetingTranscriptExcerpt || null,
        source_url: input.sourceUrl || null,
        status: input.status,
        has_been_used: input.hasBeenUsed || false,
        content_pillar_ids: input.contentPillarIds || [],
        target_audience_ids: input.targetAudienceIds || []
      };
      
      const { data, error } = await supabase
        .from("content_ideas")
        .insert([ideaData])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToContentIdea(data);
    },
    'creating idea',
    {
      successMessage: 'Content idea created successfully',
      errorMessage: 'Failed to create content idea',
      onSuccess: () => {
        invalidateQueries(['ideas', user?.id]);
      }
    }
  );
  
  const createIdea = async (input: IdeaCreateInput): Promise<ContentIdea> => {
    return createIdeaMutation.mutateAsync(input);
  };

  return {
    createIdea,
    createIdeaMutation
  };
};
