
import { WeeklyStats } from '@/types';
import { UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { startOfWeek, addWeeks, format, subWeeks } from 'date-fns';

/**
 * Fetches weekly stats for analytics charts
 */
export const fetchWeeklyStats = async (): Promise<WeeklyStats[]> => {
  const { user } = useAuth.getState();
  
  if (!user?.id) {
    return [];
  }

  // Generate last 4 weeks (for 4 data points)
  const weeks = [];
  const now = new Date();
  
  for (let i = 4; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i));
    const weekEnd = addWeeks(weekStart, 1);
    
    weeks.push({
      start: weekStart,
      end: weekEnd,
      label: format(weekStart, 'MMM d')
    });
  }

  // Generate stats for each week
  const weeklyStats: WeeklyStats[] = [];
  
  for (const week of weeks) {
    // Get ideas count for this week
    const { count: ideasCount, error: ideasError } = await supabase
      .from('content_ideas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', week.start.toISOString())
      .lt('created_at', week.end.toISOString());
      
    if (ideasError) console.error('Error fetching weekly ideas:', ideasError);

    // Get drafts count for this week
    const { count: draftsCount, error: draftsError } = await supabase
      .from('content_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .gte('created_at', week.start.toISOString())
      .lt('created_at', week.end.toISOString());
      
    if (draftsError) console.error('Error fetching weekly drafts:', draftsError);

    // Get published count for this week
    const { count: publishedCount, error: publishedError } = await supabase
      .from('content_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'published')
      .gte('created_at', week.start.toISOString())
      .lt('created_at', week.end.toISOString());
      
    if (publishedError) console.error('Error fetching weekly published:', publishedError);

    weeklyStats.push({
      date: week.label,
      ideas: ideasCount || 0,
      drafts: draftsCount || 0,
      published: publishedCount || 0
    });
  }

  return weeklyStats;
};

/**
 * Query options for weekly stats
 */
export const getFetchWeeklyStatsOptions = (options?: Partial<UseQueryOptions<WeeklyStats[], Error>>) => ({
  queryKey: ['weekly-stats'],
  staleTime: 1000 * 60 * 60, // 1 hour
  ...options
});
