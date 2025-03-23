
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
    async (idea) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case input for Supabase
      const snakeCaseInput = {
        title: idea.title,
        description: idea.description || "",
        notes: idea.notes || "",
        source: idea.source,
        meeting_transcript_excerpt: idea.meetingTranscriptExcerpt,
        source_url: idea.sourceUrl || null,
        status: idea.status,
        has_been_used: idea.hasBeenUsed || false,
        content_pillar_ids: idea.contentPillarIds || [],
        target_audience_ids: idea.targetAudienceIds || [],
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("content_ideas")
        .insert([snakeCaseInput])
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
  
  const createIdea = async (idea: IdeaCreateInput): Promise<ContentIdea> => {
    return createIdeaMutation.mutateAsync(idea);
  };

  return {
    createIdea,
    createIdeaMutation
  };
};
