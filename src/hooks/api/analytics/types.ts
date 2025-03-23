
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';

/**
 * Analytics API response type
 */
export interface AnalyticsApiResponse {
  // Fetch operations
  fetchContentStatusCounts: {
    data: ContentStatusCounts | undefined;
    isLoading: boolean;
    refetch: () => Promise<ContentStatusCounts>;
  };
  fetchWeeklyStats: {
    data: WeeklyStats[] | undefined;
    isLoading: boolean;
    refetch: () => Promise<WeeklyStats[]>;
  };
  fetchActivityFeed: {
    data: ActivityFeedItem[] | undefined;
    isLoading: boolean;
    refetch: () => Promise<ActivityFeedItem[]>;
  };
  
  // Overall loading state
  isLoading: boolean;
}
