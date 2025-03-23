
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
      
      // First, get the current audience to get its current usage count
      const { data: currentData, error: fetchError } = await supabase
        .from("target_audiences")
        .select("usage_count")
        .eq("id", id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const currentCount = currentData.usage_count || 0;
      
      // Update the usage count
      const { data, error } = await supabase
        .from("target_audiences")
        .update({ 
          usage_count: currentCount + 1
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'incrementing target audience usage count',
    {
      suppressToast: true, // Don't show a toast for this common operation
      onSuccess: (_, id) => {
        invalidateQueries(['targetAudiences', user?.id]);
        invalidateQueries(['targetAudience', id]);
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
