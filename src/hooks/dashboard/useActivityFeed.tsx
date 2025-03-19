
import { useState, useEffect } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { ActivityItem } from '@/components/dashboard/ActivityFeed';

export function useActivityFeed() {
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isIdeasLoading || isDraftsLoading) return;
    
    setIsLoading(true);
    
    // Create a combined array of activities
    const allActivities: ActivityItem[] = [];
    
    // Add idea creation activities
    ideas.forEach(idea => {
      allActivities.push({
        id: `idea-${idea.id}`,
        type: 'idea_created',
        title: idea.title,
        timestamp: new Date(idea.createdAt),
        status: idea.status,
        route: `/ideas/${idea.id}`
      });
    });
    
    // Add draft generation activities
    drafts.forEach(draft => {
      allActivities.push({
        id: `draft-${draft.id}`,
        type: 'draft_generated',
        title: draft.ideaTitle,
        timestamp: new Date(draft.createdAt),
        status: 'drafted',
        route: `/drafts/${draft.id}`
      });
    });
    
    // Sort by timestamp descending (newest first)
    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Take only the 5 most recent activities
    setActivities(allActivities.slice(0, 5));
    setIsLoading(false);
  }, [ideas, drafts, isIdeasLoading, isDraftsLoading]);
  
  return {
    activities,
    isLoading
  };
}
