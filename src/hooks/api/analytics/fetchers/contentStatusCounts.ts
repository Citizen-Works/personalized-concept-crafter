
import { ContentStatusCounts } from '@/types';
import { UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

/**
 * Fetches content status counts for the dashboard
 */
export const fetchContentStatusCounts = async (): Promise<ContentStatusCounts> => {
  const { user } = useAuth.getState();
  
  if (!user?.id) {
    return {
      ideas: 0,
      drafts: 0,
      published: 0,
      reviewQueue: 0
    };
  }

  // Get ideas count
  const { count: ideasCount, error: ideasError } = await supabase
    .from('content_ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'approved');
    
  if (ideasError) console.error('Error fetching ideas count:', ideasError);

  // Get drafts count
  const { count: draftsCount, error: draftsError } = await supabase
    .from('content_drafts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'draft');
    
  if (draftsError) console.error('Error fetching drafts count:', draftsError);

  // Get published count
  const { count: publishedCount, error: publishedError } = await supabase
    .from('content_drafts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'published');
    
  if (publishedError) console.error('Error fetching published count:', publishedError);

  // Get review queue count
  const { count: reviewCount, error: reviewError } = await supabase
    .from('content_drafts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'review');
    
  if (reviewError) console.error('Error fetching review count:', reviewError);

  return {
    ideas: ideasCount || 0,
    drafts: draftsCount || 0,
    published: publishedCount || 0,
    reviewQueue: reviewCount || 0
  };
};

/**
 * Query options for content status counts
 */
export const getFetchContentStatusCountsOptions = (options?: Partial<UseQueryOptions<ContentStatusCounts, Error>>) => ({
  queryKey: ['content-status-counts'],
  staleTime: 1000 * 60 * 5, // 5 minutes
  ...options
});
