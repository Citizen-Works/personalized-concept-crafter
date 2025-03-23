
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { PersonalStoryCreateInput } from './types';

/**
 * Hook for creating a new personal story
 */
export const useCreatePersonalStory = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const createPersonalStoryMutation = createMutation<PersonalStory, PersonalStoryCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Convert camelCase to snake_case for the database
      const storyData = {
        user_id: user.id,
        title: input.title,
        content: input.content,
        tags: input.tags || [],
        content_pillar_ids: input.contentPillarIds || [],
        target_audience_ids: input.targetAudienceIds || [],
        lesson: input.lesson || null,
        usage_guidance: input.usageGuidance || null
      };
      
      const { data, error } = await supabase
        .from("personal_stories")
        .insert([storyData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform the response to match our PersonalStory type
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        contentPillarIds: data.content_pillar_ids || [],
        targetAudienceIds: data.target_audience_ids || [],
        lesson: data.lesson || "",
        usageGuidance: data.usage_guidance || "",
        usageCount: data.usage_count || 0,
        lastUsedDate: data.last_used_date,
        isArchived: data.is_archived || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    },
    'creating personal story',
    {
      successMessage: 'Personal story created successfully',
      errorMessage: 'Failed to create personal story',
      onSuccess: () => {
        invalidateQueries(['personalStories']);
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
