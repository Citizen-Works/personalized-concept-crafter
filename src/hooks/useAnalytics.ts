
import { useCallback } from 'react';
import { useAnalyticsApi } from './api/useAnalyticsApi';

export function useAnalytics() {
  const { 
    fetchContentStatusCounts, 
    fetchWeeklyStats, 
    fetchActivityFeed 
  } = useAnalyticsApi();

  // Extract data from the queries
  const contentStatusCounts = fetchContentStatusCounts.data || {
    ideas: 0,
    drafts: 0,
    published: 0,
    reviewQueue: 0
  };
  
  const weeklyStats = fetchWeeklyStats.data || [];
  const activityFeed = fetchActivityFeed.data || [];
  
  // Loading states
  const isLoadingStatusCounts = fetchContentStatusCounts.isLoading;
  const isLoadingWeeklyStats = fetchWeeklyStats.isLoading;
  const isLoadingActivityFeed = fetchActivityFeed.isLoading;
  
  // Refetch all analytics data
  const refetchAll = useCallback(() => {
    fetchContentStatusCounts.refetch();
    fetchWeeklyStats.refetch();
    fetchActivityFeed.refetch();
  }, [fetchContentStatusCounts, fetchWeeklyStats, fetchActivityFeed]);

  return {
    contentStatusCounts,
    weeklyStats,
    activityFeed,
    isLoadingStatusCounts,
    isLoadingWeeklyStats,
    isLoadingActivityFeed,
    refetchAll,
    refetchStatusCounts: fetchContentStatusCounts.refetch,
    refetchWeeklyStats: fetchWeeklyStats.refetch,
    refetchActivityFeed: fetchActivityFeed.refetch
  };
}
