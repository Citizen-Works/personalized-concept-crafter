
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';

/**
 * Hook for incrementing a personal story's usage count
 */
export const useIncrementUsageCount = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('PersonalStoriesApi');

  const incrementUsageCountMutation = createMutation<PersonalStory, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // First increment the usage count
      await supabase.rpc("increment", { row_id: id });
      
      // Then update the last used date
      const { data, error } = await supabase
        .from("personal_stories")
        .update({ 
          last_used_date: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToPersonalStory(data);
    },
    'incrementing story usage count',
    {
      successMessage: 'Story usage updated',
      errorMessage: 'Failed to update story usage',
      onSuccess: (_, id) => {
        invalidateQueries(['personalStories', user?.id]);
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
