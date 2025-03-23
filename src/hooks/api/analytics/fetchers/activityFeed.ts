
import { ActivityFeedItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { measurePerformance } from '@/utils/monitoringUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Fetch activity feed
 */
export const fetchActivityFeed = async (): Promise<ActivityFeedItem[]> => {
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
};

/**
 * Create fetchActivityFeed query options
 */
export const getFetchActivityFeedOptions = (
  options?: Partial<UseQueryOptions<ActivityFeedItem[], Error>>
): Partial<UseQueryOptions<ActivityFeedItem[], Error>> => {
  return {
    queryKey: ['analytics', 'activity-feed'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  };
};
