
import { PersonalStory } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';
import { PersonalStoryCreateInput } from './types';

/**
 * Hook for creating a new personal story
 */
export const useCreatePersonalStory = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const createPersonalStoryMutation = createMutation<PersonalStory, PersonalStoryCreateInput>(
    async (personalStory) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case input for Supabase
      const snakeCaseInput = {
        title: personalStory.title,
        content: personalStory.content,
        tags: personalStory.tags || [],
        content_pillar_ids: personalStory.contentPillarIds || [],
        target_audience_ids: personalStory.targetAudienceIds || [],
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("personal_stories")
        .insert([snakeCaseInput])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToPersonalStory(data);
    },
    'creating personal story',
    {
      successMessage: 'Personal story created successfully',
      errorMessage: 'Failed to create personal story',
      onSuccess: () => {
        invalidateQueries(['personalStories', user?.id]);
      }
    }
  );
  
  const createPersonalStory = async (input: PersonalStoryCreateInput): Promise<PersonalStory> => {
    return createPersonalStoryMutation.mutateAsync(input);
  };

  return {
    createPersonalStory,
    createPersonalStoryMutation
  };
};
