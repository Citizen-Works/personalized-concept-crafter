
import { useContentStatusCounts, useWeeklyStats, useActivityFeed } from './dashboard';

export function useDashboardData() {
  const { statusCounts, isLoading: isStatusLoading } = useContentStatusCounts();
  const { weeklyStats, isLoading: isWeeklyStatsLoading } = useWeeklyStats();
  const { activities, isLoading: isActivityLoading } = useActivityFeed();
  
  return {
    statusCounts,
    weeklyStats,
    activities,
    isLoading: {
      ideas: isStatusLoading || isWeeklyStatsLoading,
      drafts: isWeeklyStatsLoading,
      activities: isActivityLoading
    }
  };
}
