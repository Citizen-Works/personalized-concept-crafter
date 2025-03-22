
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { ContentIdea } from '@/types';

export function useContentStatusCounts() {
  const { ideas, isLoading } = useIdeas();
  
  const statusCounts = useMemo(() => {
    const needsReviewCount = ideas.filter(idea => idea.status === 'unreviewed').length;
    const inProgressCount = ideas.filter(idea => ['approved', 'drafted', 'draft'].includes(idea.status as string)).length;
    const readyToPublishCount = ideas.filter(idea => ['ready'].includes(idea.status as string)).length;
    const publishedCount = ideas.filter(idea => idea.status === 'published').length;
    
    return {
      needsReview: needsReviewCount,
      inProgress: inProgressCount,
      readyToPublish: readyToPublishCount,
      published: publishedCount
    };
  }, [ideas]);
  
  return {
    statusCounts,
    isLoading
  };
}
