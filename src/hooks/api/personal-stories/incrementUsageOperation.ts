
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useUpdatePersonalStory } from './updateOperation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

/**
 * Hook for incrementing the usage count of a personal story
 */
export const useIncrementUsageCount = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');
  const { updatePersonalStory } = useUpdatePersonalStory();

  const incrementUsageCountMutation = createMutation<PersonalStory, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // First, get the current story to get its current usage count
      const { data, error } = await supabase
        .from("personal_stories")
        .select("usage_count")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      
      const currentCount = data.usage_count || 0;
      
      // Update the usage count and last_used_date
      return updatePersonalStory(id, { 
        usageCount: currentCount + 1
      });
    },
    'incrementing personal story usage count',
    {
      suppressToast: true, // Don't show a toast for this common operation
      onSuccess: (_, id) => {
        // Also add an entry to the story_usage table if needed
        if (user?.id) {
          supabase
            .from("story_usage")
            .insert({
              story_id: id,
              user_id: user.id,
              content_id: null // Add the required content_id field, set to null if not applicable
            })
            .then(() => {
              // We don't need to handle success/error here as this is just for analytics
            });
        }
        
        invalidateQueries(['personalStories']);
        invalidateQueries(['personalStory', id]);
      }
    }
  );
  
  const incrementUsageCount = async (id: string): Promise<PersonalStory> => {
    return incrementUsageCountMutation.mutateAsync(id);
  };

  return {
    incrementUsageCount,
    incrementUsageCountMutation
  };
};
