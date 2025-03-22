
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { DraftStatus } from '@/types/content';

export function useContentStatusCounts() {
  const { ideas, isLoading: ideasLoading } = useIdeas();
  const { drafts, isLoading: draftsLoading } = useDrafts();
  
  const statusCounts = useMemo(() => {
    // Idea counts - explicitly filter out rejected ideas
    const needsReviewCount = ideas.filter(idea => idea.status === 'unreviewed').length;
    const approvedIdeasCount = ideas.filter(idea => 
      idea.status === 'approved' && !idea.hasBeenUsed
    ).length;
    
    // Draft counts - using standardized DraftStatus values
    const inProgressCount = drafts.filter(draft => draft.status === 'draft').length;
    const readyToPublishCount = drafts.filter(draft => draft.status === 'ready').length;
    const publishedCount = drafts.filter(draft => draft.status === 'published').length;
    const archivedCount = drafts.filter(draft => draft.status === 'archived').length;
    
    return {
      needsReview: needsReviewCount,
      inProgress: inProgressCount,
      readyToPublish: readyToPublishCount,
      published: publishedCount,
      archived: archivedCount,
      approvedIdeas: approvedIdeasCount
    };
  }, [ideas, drafts]);
  
  return {
    statusCounts,
    isLoading: ideasLoading || draftsLoading
  };
}
