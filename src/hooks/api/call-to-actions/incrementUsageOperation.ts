
import { CallToAction } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToCallToAction } from './transformUtils';

/**
 * Hook for incrementing usage count for a call to action
 */
export const useIncrementCallToActionUsage = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('CallToActionsApi');

  const incrementUsageCountMutation = createMutation<CallToAction, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // First, get the current CTA to get its current usage count
      const { data: currentCta, error: fetchError } = await supabase
        .from("call_to_actions")
        .select("usage_count")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Increment the usage count directly
      const newCount = (currentCta.usage_count || 0) + 1;
      
      const { data, error } = await supabase
        .from("call_to_actions")
        .update({ usage_count: newCount })
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToCallToAction(data);
    },
    'incrementing usage count',
    {
      successMessage: 'Usage count incremented',
      errorMessage: 'Failed to increment usage count',
      onSuccess: (data) => {
        invalidateQueries(['callToActions', user?.id]);
        invalidateQueries(['callToAction', data.id, user?.id]);
      }
    }
  );
  
  const incrementUsageCount = async (id: string): Promise<CallToAction> => {
    return incrementUsageCountMutation.mutateAsync(id);
  };

  return {
    incrementUsageCount,
    incrementUsageCountMutation
  };
};
