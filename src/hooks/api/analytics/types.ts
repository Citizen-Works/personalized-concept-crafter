
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { QueryObserverResult } from '@tanstack/react-query';

/**
 * Analytics API response type
 */
export interface AnalyticsApiResponse {
  // Fetch operations
  fetchContentStatusCounts: {
    data: ContentStatusCounts | undefined;
    isLoading: boolean;
    refetch: () => Promise<QueryObserverResult<ContentStatusCounts, Error>>;
  };
  fetchWeeklyStats: {
    data: WeeklyStats[] | undefined;
    isLoading: boolean;
    refetch: () => Promise<QueryObserverResult<WeeklyStats[], Error>>;
  };
  fetchActivityFeed: {
    data: ActivityFeedItem[] | undefined;
    isLoading: boolean;
    refetch: () => Promise<QueryObserverResult<ActivityFeedItem[], Error>>;
  };
  
  // Overall loading state
  isLoading: boolean;
}
