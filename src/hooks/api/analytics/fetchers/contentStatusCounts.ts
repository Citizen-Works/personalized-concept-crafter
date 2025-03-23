
import { ContentStatusCounts } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { measurePerformance } from '@/utils/monitoringUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Fetch content status counts
 */
export const fetchContentStatusCounts = async (): Promise<ContentStatusCounts> => {
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
};

/**
 * Create fetchContentStatusCounts query options
 */
export const getFetchContentStatusCountsOptions = (
  options?: Partial<UseQueryOptions<ContentStatusCounts, Error>>
): Partial<UseQueryOptions<ContentStatusCounts, Error>> => {
  return {
    queryKey: ['analytics', 'content-status-counts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  };
};
