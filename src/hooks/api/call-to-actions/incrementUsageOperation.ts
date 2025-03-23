
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
      
      // Use RPC to increment the usage count
      const { data, error } = await supabase
        .rpc('increment', { row_id: id })
        .then(async () => {
          // Fetch the updated record
          return await supabase
            .from("call_to_actions")
            .select("*")
            .eq("id", id)
            .single();
        });
        
      if (error) throw error;
      
      return transformToCallToAction(data);
    },
    'incrementing usage count',
    {
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
