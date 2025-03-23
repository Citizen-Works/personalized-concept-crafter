
import { CallToAction } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateCallToAction } from './updateOperation';

/**
 * Hook for incrementing a call to action's usage count
 */
export const useIncrementUsageCount = () => {
  const { createMutation } = useTanstackApiQuery('CallToActionsApi');
  const { updateCallToAction } = useUpdateCallToAction();

  const incrementUsageCountMutation = createMutation<number, string>(
    async (id) => {
      const { data: cta } = await supabase
        .from('call_to_actions')
        .select('usage_count')
        .eq('id', id)
        .single();
        
      const newCount = (cta?.usage_count || 0) + 1;
      
      await updateCallToAction(id, { usageCount: newCount });
      
      return newCount;
    },
    'incrementing call to action usage count',
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
