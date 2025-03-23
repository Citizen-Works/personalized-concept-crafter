
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
      
      // First get the current audience to get the current usage count
      const { data: currentAudience, error: fetchError } = await supabase
        .from("target_audiences")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Increment the usage count directly
      const newCount = (currentAudience.usage_count || 0) + 1;
      
      const { data, error } = await supabase
        .from("target_audiences")
        .update({ usage_count: newCount })
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
