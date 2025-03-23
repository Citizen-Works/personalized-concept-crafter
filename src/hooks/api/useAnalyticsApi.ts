
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { useFetchAnalytics } from './analytics/fetchOperations';
import { AnalyticsApiResponse } from './analytics/types';

/**
 * Hook for standardized Analytics API operations
 */
export function useAnalyticsApi(): AnalyticsApiResponse {
  const { 
    fetchContentStatusCounts, 
    fetchWeeklyStats, 
    fetchActivityFeed,
    isLoading
  } = useFetchAnalytics();
  
  return {
    // Query operations
    fetchContentStatusCounts,
    fetchWeeklyStats,
    fetchActivityFeed,
    
    // Loading state
    isLoading
  };
}

// Re-export types for convenience
export type { ContentStatusCounts, WeeklyStats, ActivityFeedItem };
