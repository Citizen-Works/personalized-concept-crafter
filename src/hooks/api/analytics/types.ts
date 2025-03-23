
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';

/**
 * Analytics API response type
 */
export interface AnalyticsApiResponse {
  // Fetch operations
  fetchContentStatusCounts: () => Promise<ContentStatusCounts>;
  fetchWeeklyStats: () => Promise<WeeklyStats[]>;
  fetchActivityFeed: () => Promise<ActivityFeedItem[]>;
  
  // Loading state
  isLoading: boolean;
}
