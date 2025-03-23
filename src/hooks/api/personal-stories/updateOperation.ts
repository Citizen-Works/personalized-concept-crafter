
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Convert camelCase to snake_case for the database
      const updateData: Record<string, any> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.contentPillarIds !== undefined) updateData.content_pillar_ids = updates.contentPillarIds;
      if (updates.targetAudienceIds !== undefined) updateData.target_audience_ids = updates.targetAudienceIds;
      if (updates.lesson !== undefined) updateData.lesson = updates.lesson;
      if (updates.usageGuidance !== undefined) updateData.usage_guidance = updates.usageGuidance;
      if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
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
    'updating personal story',
    {
      successMessage: 'Personal story updated successfully',
      errorMessage: 'Failed to update personal story',
      onSuccess: (_, { id }) => {
        invalidateQueries(['personalStories']);
        invalidateQueries(['personalStory', id]);
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
