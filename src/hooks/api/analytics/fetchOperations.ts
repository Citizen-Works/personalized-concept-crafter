
import { ContentStatusCounts, WeeklyStats, ActivityFeedItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { measurePerformance } from '@/utils/monitoringUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Hook containing analytics fetch operations
 */
export const useFetchAnalytics = () => {
  const { createQuery } = useTanstackApiQuery('AnalyticsApi');

  /**
   * Fetch content status counts
   */
  const fetchContentStatusCountsQuery = (options?: Partial<UseQueryOptions<ContentStatusCounts, Error>>) => 
    createQuery<ContentStatusCounts, Error>(
      async () => {
        return await measurePerformance('fetchContentStatusCounts', async () => {
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id;
          if (!userId) throw new Error('User not authenticated');

          // Fetch counts in parallel for better performance
          const [ideasResponse, draftsResponse, publishedResponse] = await Promise.all([
            supabase
              .from('content_ideas')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId),

            supabase
              .from('content_drafts')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId),

            supabase
              .from('content_drafts')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('status', 'published')
          ]);

          // Get review queue count (ideas with status 'pending_review')
          const reviewQueueResponse = await supabase
            .from('content_ideas')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'pending_review');

          if (ideasResponse.error) throw ideasResponse.error;
          if (draftsResponse.error) throw draftsResponse.error;
          if (publishedResponse.error) throw publishedResponse.error;
          if (reviewQueueResponse.error) throw reviewQueueResponse.error;

          return {
            ideas: ideasResponse.count || 0,
            drafts: draftsResponse.count || 0,
            published: publishedResponse.count || 0,
            reviewQueue: reviewQueueResponse.count || 0
          };
        });
      },
      'fetch-content-status-counts',
      {
        queryKey: ['analytics', 'content-status-counts'],
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options
      }
    );

  /**
   * Fetch weekly stats for charts
   */
  const fetchWeeklyStatsQuery = (options?: Partial<UseQueryOptions<WeeklyStats[], Error>>) => 
    createQuery<WeeklyStats[], Error>(
      async () => {
        return await measurePerformance('fetchWeeklyStats', async () => {
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id;
          if (!userId) throw new Error('User not authenticated');

          // Return example data since there's no RPC call
          return generateExampleWeeklyStats();
        });
      },
      'fetch-weekly-stats',
      {
        queryKey: ['analytics', 'weekly-stats'],
        staleTime: 1000 * 60 * 15, // 15 minutes
        ...options
      }
    );

  /**
   * Fetch activity feed
   */
  const fetchActivityFeedQuery = (options?: Partial<UseQueryOptions<ActivityFeedItem[], Error>>) => 
    createQuery<ActivityFeedItem[], Error>(
      async () => {
        return await measurePerformance('fetchActivityFeed', async () => {
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id;
          if (!userId) throw new Error('User not authenticated');

          // Query recent ideas and drafts to build an activity feed
          const [ideasResponse, draftsResponse] = await Promise.all([
            supabase
              .from('content_ideas')
              .select('id, title, created_at, updated_at, status')
              .eq('user_id', userId)
              .order('updated_at', { ascending: false })
              .limit(5),

            supabase
              .from('content_drafts')
              .select('id, content_idea_id, created_at, updated_at, status')
              .eq('user_id', userId)
              .order('updated_at', { ascending: false })
              .limit(5)
          ]);

          if (ideasResponse.error) throw ideasResponse.error;
          if (draftsResponse.error) throw draftsResponse.error;

          // Process ideas into activity items
          const ideaActivities = (ideasResponse.data || []).map(idea => ({
            id: `idea-${idea.id}`,
            type: 'idea' as const,
            action: idea.created_at === idea.updated_at ? 'created' as const : 'updated' as const,
            title: idea.title || 'Untitled Idea',
            timestamp: new Date(idea.updated_at),
            entityId: idea.id,
            route: `/ideas/${idea.id}`
          }));

          // Get idea titles for drafts
          const ideaIds = draftsResponse.data?.map(draft => draft.content_idea_id) || [];
          const ideasForDrafts = ideaIds.length > 0
            ? await supabase
                .from('content_ideas')
                .select('id, title')
                .in('id', ideaIds)
            : { data: [] };

          // Create a map of idea IDs to titles for quick lookup
          const ideaTitlesMap = (ideasForDrafts.data || []).reduce(
            (map, idea) => ({ ...map, [idea.id]: idea.title }), 
            {} as Record<string, string>
          );

          // Process drafts into activity items
          const draftActivities = (draftsResponse.data || []).map(draft => {
            const ideaTitle = ideaTitlesMap[draft.content_idea_id] || 'Untitled Idea';
            const isPublished = draft.status === 'published';
            
            return {
              id: `draft-${draft.id}`,
              type: isPublished ? 'published' as const : 'draft' as const,
              action: isPublished ? 'published' as const : 
                     (draft.created_at === draft.updated_at ? 'created' as const : 'updated' as const),
              title: ideaTitle,
              timestamp: new Date(draft.updated_at),
              entityId: draft.id,
              route: `/drafts/${draft.id}`
            };
          });

          // Combine and sort all activities by timestamp
          const allActivities = [...ideaActivities, ...draftActivities]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10); // Take the most recent 10 activities

          return allActivities;
        });
      },
      'fetch-activity-feed',
      {
        queryKey: ['analytics', 'activity-feed'],
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options
      }
    );

  // Create base queries to monitor loading state
  const statusCountsQuery = fetchContentStatusCountsQuery();
  const weeklyStatsQuery = fetchWeeklyStatsQuery();
  const activityFeedQuery = fetchActivityFeedQuery();
  
  return {
    fetchContentStatusCounts: async () => {
      const result = await statusCountsQuery.refetch();
      return result.data || { ideas: 0, drafts: 0, published: 0, reviewQueue: 0 };
    },
    fetchWeeklyStats: async () => {
      const result = await weeklyStatsQuery.refetch();
      return result.data || [];
    },
    fetchActivityFeed: async () => {
      const result = await activityFeedQuery.refetch();
      return result.data || [];
    },
    isLoading: statusCountsQuery.isLoading || weeklyStatsQuery.isLoading || activityFeedQuery.isLoading
  };
};

// Helper function to generate example weekly stats data for fallback or testing
function generateExampleWeeklyStats(): WeeklyStats[] {
  const stats: WeeklyStats[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    stats.push({
      date: date.toISOString().split('T')[0],
      ideas: Math.floor(Math.random() * 5),
      drafts: Math.floor(Math.random() * 4),
      published: Math.floor(Math.random() * 2)
    });
  }
  
  return stats;
}
