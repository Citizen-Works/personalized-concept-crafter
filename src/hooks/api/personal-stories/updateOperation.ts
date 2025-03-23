
import { PersonalStory } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';
import { PersonalStoryUpdateInput } from './types';

/**
 * Hook for updating an existing personal story
 */
export const useUpdatePersonalStory = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const updatePersonalStoryMutation = createMutation<PersonalStory, { id: string, updates: PersonalStoryUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case update data for Supabase
      const updateData: Record<string, any> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.contentPillarIds !== undefined) updateData.content_pillar_ids = updates.contentPillarIds;
      if (updates.targetAudienceIds !== undefined) updateData.target_audience_ids = updates.targetAudienceIds;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToPersonalStory(data);
    },
    'updating personal story',
    {
      successMessage: 'Personal story updated successfully',
      errorMessage: 'Failed to update personal story',
      onSuccess: () => {
        invalidateQueries(['personalStories', user?.id]);
      }
    }
  );
  
  const updatePersonalStory = async (id: string, updates: PersonalStoryUpdateInput): Promise<PersonalStory> => {
    return updatePersonalStoryMutation.mutateAsync({ id, updates });
  };

  return {
    updatePersonalStory,
    updatePersonalStoryMutation
  };
};
