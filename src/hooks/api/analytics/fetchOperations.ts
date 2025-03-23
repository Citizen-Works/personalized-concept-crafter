
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { 
  fetchContentStatusCounts,
  getFetchContentStatusCountsOptions,
  fetchWeeklyStats,
  getFetchWeeklyStatsOptions,
  fetchActivityFeed,
  getFetchActivityFeedOptions
} from './fetchers';

/**
 * Hook containing analytics fetch operations
 */
export const useFetchAnalytics = () => {
  const { createQuery } = useTanstackApiQuery('AnalyticsApi');
  const { user } = useAuth();
  const userId = user?.id;

  /**
   * Fetch content status counts
   */
  const fetchContentStatusCountsQuery = (options?: Partial<UseQueryOptions<ContentStatusCounts, Error>>) => 
    createQuery<ContentStatusCounts, Error>(
      () => fetchContentStatusCounts(userId),
      'fetch-content-status-counts',
      {
        ...getFetchContentStatusCountsOptions(userId, options)
      }
    );

  /**
   * Fetch weekly stats for charts
   */
  const fetchWeeklyStatsQuery = (options?: Partial<UseQueryOptions<WeeklyStats[], Error>>) => 
    createQuery<WeeklyStats[], Error>(
      () => fetchWeeklyStats(userId),
      'fetch-weekly-stats',
      {
        ...getFetchWeeklyStatsOptions(userId, options)
      }
    );

  /**
   * Fetch activity feed
   */
  const fetchActivityFeedQuery = (options?: Partial<UseQueryOptions<ActivityFeedItem[], Error>>) => 
    createQuery<ActivityFeedItem[], Error>(
      () => fetchActivityFeed(userId),
      'fetch-activity-feed',
      {
        ...getFetchActivityFeedOptions(userId, options)
      }
    );

  // Create base queries to monitor loading state
  const statusCountsQuery = fetchContentStatusCountsQuery();
  const weeklyStatsQuery = fetchWeeklyStatsQuery();
  const activityFeedQuery = fetchActivityFeedQuery();
  
  return {
    fetchContentStatusCounts: statusCountsQuery,
    fetchWeeklyStats: weeklyStatsQuery,
    fetchActivityFeed: activityFeedQuery,
    isLoading: statusCountsQuery.isLoading || weeklyStatsQuery.isLoading || activityFeedQuery.isLoading
  };
};

// Re-export all fetcher functions for direct use
export {
  fetchContentStatusCounts,
  fetchWeeklyStats,
  fetchActivityFeed
};
