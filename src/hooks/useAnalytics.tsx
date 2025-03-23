
import { useCallback, useState, useEffect } from 'react';
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { useAnalyticsApi } from './api/useAnalyticsApi';

/**
 * Hook that provides analytics data and loading states for the dashboard
 */
export function useAnalytics() {
  const analyticsApi = useAnalyticsApi();
  
  // State for analytics data
  const [contentStatusCounts, setContentStatusCounts] = useState<ContentStatusCounts>({ 
    ideas: 0, drafts: 0, published: 0, reviewQueue: 0 
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  
  // Loading states
  const [isLoadingStatusCounts, setIsLoadingStatusCounts] = useState(true);
  const [isLoadingWeeklyStats, setIsLoadingWeeklyStats] = useState(true);
  const [isLoadingActivityFeed, setIsLoadingActivityFeed] = useState(true);

  // Fetch content status counts
  const fetchStatusCounts = useCallback(async () => {
    try {
      setIsLoadingStatusCounts(true);
      const data = await analyticsApi.fetchContentStatusCounts();
      setContentStatusCounts(data);
    } catch (error) {
      console.error('Failed to fetch content status counts:', error);
    } finally {
      setIsLoadingStatusCounts(false);
    }
  }, [analyticsApi]);

  // Fetch weekly stats
  const fetchWeeklyStats = useCallback(async () => {
    try {
      setIsLoadingWeeklyStats(true);
      const data = await analyticsApi.fetchWeeklyStats();
      setWeeklyStats(data);
    } catch (error) {
      console.error('Failed to fetch weekly stats:', error);
    } finally {
      setIsLoadingWeeklyStats(false);
    }
  }, [analyticsApi]);

  // Fetch activity feed
  const fetchActivityFeed = useCallback(async () => {
    try {
      setIsLoadingActivityFeed(true);
      const data = await analyticsApi.fetchActivityFeed();
      setActivityFeed(data);
    } catch (error) {
      console.error('Failed to fetch activity feed:', error);
    } finally {
      setIsLoadingActivityFeed(false);
    }
  }, [analyticsApi]);

  // Fetch all data
  const refetchAll = useCallback(() => {
    fetchStatusCounts();
    fetchWeeklyStats();
    fetchActivityFeed();
  }, [fetchStatusCounts, fetchWeeklyStats, fetchActivityFeed]);

  // Initial data fetch
  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

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
    refetchAll
  };
}
