
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';

type Activity = {
  id: string;
  title: string;
  type: 'idea_created' | 'draft_generated' | 'status_changed' | 'transcript_processed';
  status: string;
  timestamp: Date;
  entityId: string;
  route: string;
};

export function useActivityFeed() {
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  
  const activities = useMemo(() => {
    const allActivities: Activity[] = [];
    
    // Add ideas as activities
    ideas.forEach(idea => {
      allActivities.push({
        id: `idea-${idea.id}`,
        title: idea.title,
        type: 'idea_created',
        status: idea.status,
        timestamp: idea.createdAt,
        entityId: idea.id,
        route: `/ideas/${idea.id}`
      });
    });
    
    // Add drafts as activities
    drafts.forEach(draft => {
      allActivities.push({
        id: `draft-${draft.id}`,
        title: draft.ideaTitle,
        type: 'draft_generated',
        status: 'draft',
        timestamp: draft.createdAt,
        entityId: draft.id,
        route: `/drafts/${draft.id}`
      });
    });
    
    // Sort activities by timestamp, newest first
    return allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [ideas, drafts]);
  
  return {
    activities,
    isLoading: isIdeasLoading || isDraftsLoading
  };
}
