
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { UseQueryResult } from '@tanstack/react-query';

export interface AnalyticsApiResponse {
  fetchContentStatusCounts: UseQueryResult<ContentStatusCounts, Error>;
  fetchWeeklyStats: UseQueryResult<WeeklyStats[], Error>;
  fetchActivityFeed: UseQueryResult<ActivityFeedItem[], Error>;
  isLoading: boolean;
}
