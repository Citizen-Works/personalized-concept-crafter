
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';

/**
 * Hook for incrementing the usage count of a target audience
 */
export const useIncrementTargetAudienceUsage = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const incrementUsageCountMutation = createMutation<TargetAudience, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Increment the usage_count directly in the update
      const { data, error } = await supabase
        .from("target_audiences")
        .update({ usage_count: supabase.rpc('increment', { row_id: id }) })
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'incrementing target audience usage',
    {
      successMessage: 'Target audience usage incremented',
      errorMessage: 'Failed to increment target audience usage',
      onSuccess: () => {
        invalidateQueries(['targetAudiences', user?.id]);
      }
    }
  );
  
  const incrementUsageCount = async (id: string): Promise<TargetAudience> => {
    return incrementUsageCountMutation.mutateAsync(id);
  };

  return {
    incrementUsageCount,
    incrementUsageCountMutation
  };
};
