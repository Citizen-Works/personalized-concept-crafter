import { ContentStatusCounts } from '@/types';
import { UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

/**
 * Fetches content status counts for the dashboard
 */
export const fetchContentStatusCounts = async (userId?: string): Promise<ContentStatusCounts> => {
  if (!userId) {
    return {
      needsReview: 0,
      approvedIdeas: 0,
      inProgress: 0,
      readyToPublish: 0,
      published: 0,
      archived: 0,
      rejectedIdeas: 0
    };
  }

  // Get ideas counts
  const { data: ideas, error: ideasError } = await supabase
    .from('content_ideas')
    .select('*')
    .eq('user_id', userId);
    
  if (ideasError) console.error('Error fetching ideas:', ideasError);

  // Get drafts with different statuses
  const { data: drafts, error: draftsError } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('user_id', userId);
    
  if (draftsError) console.error('Error fetching drafts:', draftsError);

  // Calculate counts
  const needsReview = ideas?.filter(idea => idea.status === 'unreviewed').length || 0;
  const approvedIdeas = ideas?.filter(idea => idea.status === 'approved' && !idea.has_been_used).length || 0;
  const rejectedIdeas = ideas?.filter(idea => idea.status === 'rejected').length || 0;
  
  const inProgress = drafts?.filter(draft => draft.status === 'draft').length || 0;
  const readyToPublish = drafts?.filter(draft => draft.status === 'ready').length || 0;
  const published = drafts?.filter(draft => draft.status === 'published').length || 0;
  const archived = drafts?.filter(draft => draft.status === 'archived').length || 0;

  return {
    needsReview,
    approvedIdeas,
    inProgress,
    readyToPublish,
    published,
    archived,
    rejectedIdeas
  };
};

/**
 * Query options for content status counts
 */
export const getFetchContentStatusCountsOptions = (userId?: string, options?: Partial<UseQueryOptions<ContentStatusCounts, Error>>) => ({
  queryKey: ['content-status-counts', userId],
  queryFn: () => fetchContentStatusCounts(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 5, // 5 minutes
  ...options
});
