
import { ActivityFeedItem } from '@/types';
import { UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

/**
 * Fetches activity feed for the dashboard
 */
export const fetchActivityFeed = async (): Promise<ActivityFeedItem[]> => {
  const { user } = useAuth.getState();
  
  if (!user?.id) {
    return [];
  }

  // Create an array to store all activity items
  const activityItems: ActivityFeedItem[] = [];

  // Get recent content ideas
  const { data: ideas, error: ideasError } = await supabase
    .from('content_ideas')
    .select('id, title, created_at, status_changed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (ideasError) {
    console.error('Error fetching recent ideas:', ideasError);
  } else {
    // Add ideas to activity feed
    ideas?.forEach(idea => {
      activityItems.push({
        id: `idea-${idea.id}`,
        type: 'idea',
        action: 'created',
        title: idea.title,
        timestamp: new Date(idea.created_at),
        entityId: idea.id,
        route: `/ideas/${idea.id}`
      });
    });
  }

  // Get recent drafts
  const { data: drafts, error: draftsError } = await supabase
    .from('content_drafts')
    .select('id, content_idea_id, created_at, status, updated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (draftsError) {
    console.error('Error fetching recent drafts:', draftsError);
  } else {
    // Add drafts to activity feed
    drafts?.forEach(draft => {
      const action = draft.status === 'published' ? 'published' : 'created';
      const type = draft.status === 'published' ? 'published' : 'draft';
      
      activityItems.push({
        id: `draft-${draft.id}`,
        type,
        action,
        title: `Draft #${draft.id.substring(0, 6)}`,
        timestamp: new Date(draft.status === 'published' ? draft.updated_at : draft.created_at),
        entityId: draft.id,
        route: `/drafts/${draft.id}`
      });
    });
  }

  // Sort all activity items by timestamp (newest first)
  return activityItems
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 15); // Return only the 15 most recent items
};

/**
 * Query options for activity feed
 */
export const getFetchActivityFeedOptions = (options?: Partial<UseQueryOptions<ActivityFeedItem[], Error>>) => ({
  queryKey: ['activity-feed'],
  staleTime: 1000 * 60 * 5, // 5 minutes
  ...options
});
