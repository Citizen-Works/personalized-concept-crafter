
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';

// Define the base activity type from our data sources
type Activity = {
  id: string;
  title: string;
  type: 'idea' | 'draft' | 'publish'; // Original types from data
  status: string;
  timestamp: Date;
  entityId: string;
  route: string;
};

// Define the activity type that's expected by the ActivityFeed component
export type ActivityItem = {
  id: string;
  title: string;
  type: 'idea_created' | 'draft_generated' | 'status_changed' | 'transcript_processed';
  status?: string;
  timestamp: Date;
  entityId: string;
  route: string;
};

// Map from backend activity types to frontend activity types
const mapActivityType = (type: Activity['type']): ActivityItem['type'] => {
  switch (type) {
    case 'idea':
      return 'idea_created';
    case 'draft':
      return 'draft_generated';
    case 'publish':
      return 'status_changed';
    default:
      return 'idea_created'; // Default fallback
  }
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
        type: 'idea',
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
        type: 'draft',
        status: 'draft',
        timestamp: draft.createdAt,
        entityId: draft.id,
        route: `/drafts/${draft.id}`
      });
    });
    
    // Sort activities by timestamp, newest first
    return allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [ideas, drafts]);
  
  // Map internal activity types to the types expected by the ActivityFeed component
  const mappedActivities: ActivityItem[] = useMemo(() => {
    return activities.map(activity => ({
      ...activity,
      type: mapActivityType(activity.type)
    }));
  }, [activities]);
  
  return {
    activities: mappedActivities,
    isLoading: isIdeasLoading || isDraftsLoading
  };
}
