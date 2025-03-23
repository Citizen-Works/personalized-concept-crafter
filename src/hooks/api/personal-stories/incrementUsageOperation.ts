
import { PersonalStory } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';

/**
 * Hook for incrementing usage count for a personal story
 */
export const useIncrementPersonalStoryUsage = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const incrementUsageCountMutation = createMutation<PersonalStory, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Use RPC to increment the usage count
      const { data, error } = await supabase
        .rpc('increment', { row_id: id })
        .then(async () => {
          // Fetch the updated record
          return await supabase
            .from("personal_stories")
            .select("*")
            .eq("id", id)
            .single();
        });
        
      if (error) throw error;
      
      return transformToPersonalStory(data);
    },
    'incrementing usage count',
    {
      errorMessage: 'Failed to increment usage count',
      onSuccess: (data) => {
        invalidateQueries(['personalStories', user?.id]);
        invalidateQueries(['personalStory', data.id, user?.id]);
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
