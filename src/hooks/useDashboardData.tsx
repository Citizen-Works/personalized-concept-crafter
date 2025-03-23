
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { useContentPillars } from './useContentPillars';
import { useTargetAudiences } from './useTargetAudiences';
import { useDrafts } from './useDrafts';
import { useIdeas } from './useIdeas';

export function useDashboardData() {
  const {
    contentStatusCounts,
    weeklyStats,
    activityFeed,
    isLoadingStatusCounts,
    isLoadingWeeklyStats,
    isLoadingActivityFeed,
    refetchAll
  } = useAnalytics();
  
  const { contentPillars, isLoading: isLoadingPillars } = useContentPillars();
  const { targetAudiences, isLoading: isLoadingAudiences } = useTargetAudiences();
  const { recentDrafts, isLoading: isLoadingDrafts } = useDrafts({
    limit: 5,
    sort: 'updatedAt',
    order: 'desc'
  });
  const { recentIdeas, isLoading: isLoadingIdeas } = useIdeas({
    limit: 5,
    sort: 'updatedAt',
    order: 'desc'
  });

  // Refetch all dashboard data
  const refetchAllData = useCallback(() => {
    refetchAll();
    // Additional data refetches can be added here
  }, [refetchAll]);

  return {
    // Analytics data
    contentStatusCounts,
    weeklyStats,
    activityFeed,
    
    // Business data
    contentPillars,
    targetAudiences,
    recentDrafts,
    recentIdeas,
    
    // Loading states
    isLoading: {
      statusCounts: isLoadingStatusCounts,
      weeklyStats: isLoadingWeeklyStats,
      activityFeed: isLoadingActivityFeed,
      pillars: isLoadingPillars,
      audiences: isLoadingAudiences,
      drafts: isLoadingDrafts,
      ideas: isLoadingIdeas
    },
    
    // Refetch functions
    refetchAllData
  };
}
