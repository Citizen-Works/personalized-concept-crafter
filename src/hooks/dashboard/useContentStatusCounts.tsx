
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';

export function useContentStatusCounts() {
  const { ideas, isLoading: ideasLoading } = useIdeas();
  const { drafts, isLoading: draftsLoading } = useDrafts();
  
  const statusCounts = useMemo(() => {
    // Idea counts - explicitly filter out rejected ideas instead of archived
    const needsReviewCount = ideas.filter(idea => idea.status === 'unreviewed').length;
    const approvedIdeasCount = ideas.filter(idea => 
      idea.status === 'approved' && !idea.hasBeenUsed
    ).length;
    
    // Draft counts
    const inProgressCount = drafts.filter(draft => draft.status === 'draft').length;
    const readyToPublishCount = drafts.filter(draft => draft.status === 'ready').length;
    const publishedCount = drafts.filter(draft => draft.status === 'published').length;
    
    return {
      needsReview: needsReviewCount,
      inProgress: inProgressCount,
      readyToPublish: readyToPublishCount,
      published: publishedCount,
      approvedIdeas: approvedIdeasCount
    };
  }, [ideas, drafts]);
  
  return {
    statusCounts,
    isLoading: ideasLoading || draftsLoading
  };
}
