
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateTargetAudience } from './updateOperation';

/**
 * Hook for incrementing a target audience's usage count
 */
export const useIncrementTargetAudienceUsage = () => {
  const { createMutation } = useTanstackApiQuery('TargetAudienceApi');
  const { updateTargetAudience } = useUpdateTargetAudience();

  const incrementUsageCountMutation = createMutation<number, string>(
    async (id) => {
      const { data: audience } = await supabase
        .from('target_audiences')
        .select('usage_count')
        .eq('id', id)
        .single();
        
      const newCount = (audience?.usage_count || 0) + 1;
      
      await updateTargetAudience(id, { usageCount: newCount });
      
      return newCount;
    },
    'incrementing target audience usage count',
    {
      successMessage: 'Usage count updated',
      suppressToast: true // No need for a toast on every usage increment
    }
  );
  
  const incrementUsageCount = async (id: string): Promise<number> => {
    return incrementUsageCountMutation.mutateAsync(id);
  };

  return {
    incrementUsageCount,
    incrementUsageCountMutation
  };
};
