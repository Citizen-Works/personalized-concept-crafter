import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { ContentStatus, DraftStatus } from '@/types/content';

export function useContentStatusCounts() {
  const { ideas, isLoading: ideasLoading } = useIdeas();
  const { drafts, isLoading: draftsLoading } = useDrafts();
  
  const statusCounts = useMemo(() => {
    // Idea counts using standardized ContentStatus values
    const needsReviewCount = ideas.filter(idea => idea.status === 'unreviewed').length;
    const approvedIdeasCount = ideas.filter(idea => 
      idea.status === 'approved' && !idea.hasBeenUsed
    ).length;
    const rejectedIdeasCount = ideas.filter(idea => idea.status === 'rejected').length;
    
    // Draft counts using standardized DraftStatus values
    const inProgressCount = drafts.filter(draft => draft.status === 'draft').length;
    const readyToPublishCount = drafts.filter(draft => draft.status === 'ready').length;
    const publishedCount = drafts.filter(draft => draft.status === 'published').length;
    const archivedCount = drafts.filter(draft => draft.status === 'archived').length;
    
    return {
      needsReview: needsReviewCount,
      approvedIdeas: approvedIdeasCount,
      inProgress: inProgressCount,
      readyToPublish: readyToPublishCount,
      published: publishedCount,
      archived: archivedCount,
      rejectedIdeas: rejectedIdeasCount
    };
  }, [ideas, drafts]);
  
  return {
    statusCounts,
    isLoading: ideasLoading || draftsLoading
  };
}
