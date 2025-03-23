
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for archiving a personal story
 */
export const useArchivePersonalStory = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const archivePersonalStoryMutation = createMutation<PersonalStory, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update({ is_archived: true })
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
    'archiving personal story',
    {
      successMessage: 'Personal story archived',
      errorMessage: 'Failed to archive personal story',
      onSuccess: (_, id) => {
        invalidateQueries(['personalStories']);
        invalidateQueries(['personalStory', id]);
      }
    }
  );
  
  const archivePersonalStory = async (id: string): Promise<PersonalStory> => {
    return archivePersonalStoryMutation.mutateAsync(id);
  };

  return {
    archivePersonalStory,
    archivePersonalStoryMutation
  };
};
