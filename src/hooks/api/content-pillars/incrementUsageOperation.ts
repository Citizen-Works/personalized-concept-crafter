
import { ContentPillar } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateContentPillar } from './updateOperation';

/**
 * Hook for incrementing a content pillar's usage count
 */
export const useIncrementContentPillarUsage = () => {
  const { createMutation } = useTanstackApiQuery('ContentPillarsApi');
  const { updateContentPillar } = useUpdateContentPillar();

  const incrementUsageCountMutation = createMutation<number, string>(
    async (id) => {
      const { data: pillar } = await supabase
        .from('content_pillars')
        .select('usage_count')
        .eq('id', id)
        .single();
        
      const newCount = (pillar?.usage_count || 0) + 1;
      
      await updateContentPillar(id, { usageCount: newCount });
      
      return newCount;
    },
    'incrementing content pillar usage count',
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
