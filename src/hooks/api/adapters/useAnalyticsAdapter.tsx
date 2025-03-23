
import { useQuery } from '@tanstack/react-query';
import { useAnalyticsApi } from '../useAnalyticsApi';
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';

/**
 * Adapter hook that provides the same interface as the original useAnalytics hook
 * but uses the new standardized API pattern under the hood
 */
export const useAnalyticsAdapter = () => {
  const analyticsApi = useAnalyticsApi();
  
  // Access the queries from the API hook
  const statusCountsQuery = analyticsApi.fetchContentStatusCounts;
  const weeklyStatsQuery = analyticsApi.fetchWeeklyStats;
  const activityFeedQuery = analyticsApi.fetchActivityFeed;
  
  // Refetch all function
  const refetchAll = () => {
    statusCountsQuery.refetch();
    weeklyStatsQuery.refetch();
    activityFeedQuery.refetch();
  };
  
  return {
    // Data
    contentStatusCounts: statusCountsQuery.data || { ideas: 0, drafts: 0, published: 0, reviewQueue: 0 },
    weeklyStats: weeklyStatsQuery.data || [],
    activityFeed: activityFeedQuery.data || [],
    
    // Loading states
    isLoadingStatusCounts: statusCountsQuery.isLoading,
    isLoadingWeeklyStats: weeklyStatsQuery.isLoading,
    isLoadingActivityFeed: activityFeedQuery.isLoading,
    
    // Error states
    isErrorStatusCounts: statusCountsQuery.isError,
    isErrorWeeklyStats: weeklyStatsQuery.isError,
    isErrorActivityFeed: activityFeedQuery.isError,
    
    // Refetch functions
    refetchStatusCounts: statusCountsQuery.refetch,
    refetchWeeklyStats: weeklyStatsQuery.refetch,
    refetchActivityFeed: activityFeedQuery.refetch,
    refetchAll
  };
};
