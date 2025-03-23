
import { WeeklyStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { measurePerformance } from '@/utils/monitoringUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Fetch weekly stats for charts
 */
export const fetchWeeklyStats = async (): Promise<WeeklyStats[]> => {
  return await measurePerformance('fetchWeeklyStats', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) throw new Error('User not authenticated');

    // Return example data since there's no RPC call
    return generateExampleWeeklyStats();
  });
};

/**
 * Create fetchWeeklyStats query options
 */
export const getFetchWeeklyStatsOptions = (
  options?: Partial<UseQueryOptions<WeeklyStats[], Error>>
): Partial<UseQueryOptions<WeeklyStats[], Error>> => {
  return {
    queryKey: ['analytics', 'weekly-stats'],
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options
  };
};

// Helper function to generate example weekly stats data for fallback or testing
function generateExampleWeeklyStats(): WeeklyStats[] {
  const stats: WeeklyStats[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    stats.push({
      date: date.toISOString().split('T')[0],
      ideas: Math.floor(Math.random() * 5),
      drafts: Math.floor(Math.random() * 4),
      published: Math.floor(Math.random() * 2)
    });
  }
  
  return stats;
}
