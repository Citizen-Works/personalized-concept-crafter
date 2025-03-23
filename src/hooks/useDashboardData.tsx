
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { useContentPillars } from './useContentPillars';
import { useTargetAudiences } from './useTargetAudiences';
import { useDrafts } from './useDrafts';
import { useIdeas } from './ideas';

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
  
  // Use the drafts and ideas hooks
  const { drafts, isLoading: isLoadingDrafts } = useDrafts();
  const { ideas, isLoading: isLoadingIdeas } = useIdeas();

  // Get the 5 most recent drafts and ideas
  const recentDrafts = drafts?.slice(0, 5) || [];
  const recentIdeas = ideas?.slice(0, 5) || [];

  // Refetch all dashboard data
  const refetchAllData = useCallback(() => {
    refetchAll();
    // Additional data refetches can be added here
  }, [refetchAll]);

  // Calculate aggregate stats for dashboard components
  const weeklyMetrics = {
    ideasCreated: weeklyStats.reduce((sum, stat) => sum + stat.ideas, 0),
    draftsGenerated: weeklyStats.reduce((sum, stat) => sum + stat.drafts, 0),
    contentPublished: weeklyStats.reduce((sum, stat) => sum + stat.published, 0)
  };

  // Add route to activity feed items if not present
  const activityFeedWithRoutes = activityFeed.map(item => {
    if (!item.route) {
      // Add default routes based on activity type
      if (item.type === 'idea') {
        return { ...item, route: `/ideas/${item.entityId}` };
      } else if (item.type === 'draft' || item.type === 'published') {
        return { ...item, route: `/drafts/${item.entityId}` };
      } else {
        return { ...item, route: '#' };
      }
    }
    return item;
  });

  return {
    // Analytics data
    contentStatusCounts,
    weeklyStats,
    weeklyMetrics,
    activityFeed: activityFeedWithRoutes,
    
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
