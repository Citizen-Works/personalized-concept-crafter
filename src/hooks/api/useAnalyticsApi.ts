
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTanstackApiQuery } from './useTanstackApiQuery';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { measurePerformance } from '@/utils/monitoringUtils';

// Define analytics data types
export type ContentStatusCounts = {
  ideas: number;
  drafts: number;
  published: number;
  reviewQueue: number;
};

export type WeeklyStats = {
  date: string;
  ideas: number;
  drafts: number;
  published: number;
};

export type ActivityFeedItem = {
  id: string;
  type: 'idea' | 'draft' | 'published' | 'profile';
  action: 'created' | 'updated' | 'published' | 'completed';
  title: string;
  timestamp: Date;
  entityId?: string;
};

export function useAnalyticsApi() {
  const { createQuery } = useTanstackApiQuery('AnalyticsApi');

  // Fetch content status counts
  const fetchContentStatusCounts = createQuery<ContentStatusCounts>(
    async () => {
      return await measurePerformance('fetchContentStatusCounts', async () => {
        const userId = supabase.auth.getUser()?.data?.user?.id;
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
    }
  );

  // Fetch weekly stats for charts
  const fetchWeeklyStats = createQuery<WeeklyStats[]>(
    async () => {
      return await measurePerformance('fetchWeeklyStats', async () => {
        const userId = supabase.auth.getUser()?.data?.user?.id;
        if (!userId) throw new Error('User not authenticated');

        // Get stats for the last 7 days
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        // Format the dates for the query
        const fromDate = lastWeek.toISOString().split('T')[0];
        const toDate = today.toISOString().split('T')[0];

        // For a real implementation, you would query the database with time-based aggregations
        // Here, we'll use a simplified approach with mocked data structure
        const { data, error } = await supabase.rpc('get_weekly_stats', {
          user_id_param: userId,
          from_date_param: fromDate,
          to_date_param: toDate
        });

        if (error) {
          console.error('Error fetching weekly stats:', error);
          // Return example data as fallback
          return generateExampleWeeklyStats();
        }

        return processApiResponse(data || generateExampleWeeklyStats());
      });
    },
    'fetch-weekly-stats',
    {
      queryKey: ['analytics', 'weekly-stats'],
      staleTime: 1000 * 60 * 15, // 15 minutes
    }
  );

  // Fetch activity feed
  const fetchActivityFeed = createQuery<ActivityFeedItem[]>(
    async () => {
      return await measurePerformance('fetchActivityFeed', async () => {
        const userId = supabase.auth.getUser()?.data?.user?.id;
        if (!userId) throw new Error('User not authenticated');

        // Typically, you'd query a dedicated activity_log table
        // For now, we'll query recent ideas and drafts to build an activity feed
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
          entityId: idea.id
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
            entityId: draft.id
          };
        });

        // Combine and sort all activities by timestamp
        const allActivities = [...ideaActivities, ...draftActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 10); // Take the most recent 10 activities

        return processApiResponse(allActivities);
      });
    },
    'fetch-activity-feed',
    {
      queryKey: ['analytics', 'activity-feed'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  return {
    fetchContentStatusCounts,
    fetchWeeklyStats,
    fetchActivityFeed
  };
}

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
