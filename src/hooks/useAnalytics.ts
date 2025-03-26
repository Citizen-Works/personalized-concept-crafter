import { useCallback } from 'react';
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { useAnalyticsApi } from './api/useAnalyticsApi';

/**
 * Hook that provides analytics data and loading states for the dashboard
 */
export function useAnalytics() {
  const { 
    fetchContentStatusCounts, 
    fetchWeeklyStats, 
    fetchActivityFeed,
    isLoading 
  } = useAnalyticsApi();
  
  // Extract data from the queries with fallbacks for undefined data
  const contentStatusCounts = fetchContentStatusCounts.data || {
    needsReview: 0,
    approvedIdeas: 0,
    inProgress: 0,
    readyToPublish: 0,
    published: 0
  };
  
  const weeklyStats = fetchWeeklyStats.data || [];
  const activityFeed = fetchActivityFeed.data || [];
  
  // Loading states directly from React Query
  const isLoadingStatusCounts = fetchContentStatusCounts.isLoading;
  const isLoadingWeeklyStats = fetchWeeklyStats.isLoading;
  const isLoadingActivityFeed = fetchActivityFeed.isLoading;
  
  // Refetch all analytics data
  const refetchAll = useCallback(() => {
    fetchContentStatusCounts.refetch();
    fetchWeeklyStats.refetch();
    fetchActivityFeed.refetch();
  }, [fetchContentStatusCounts, fetchWeeklyStats, fetchActivityFeed]);

  // Calculate aggregate stats for dashboard components
  const weeklyMetrics = {
    ideasCreated: weeklyStats.reduce((sum, stat) => sum + stat.ideas, 0),
    draftsGenerated: weeklyStats.reduce((sum, stat) => sum + stat.drafts, 0),
    contentPublished: weeklyStats.reduce((sum, stat) => sum + stat.published, 0)
  };

  return {
    contentStatusCounts,
    weeklyStats,
    weeklyMetrics,
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
