
import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, subWeeks, isBefore } from 'date-fns';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { ActivityItem } from '@/components/dashboard/ActivityFeed';
import { ContentIdea } from '@/types';

export function useDashboardData() {
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  
  // Calculate status counts
  const needsReviewCount = ideas.filter(idea => idea.status === 'unreviewed').length;
  const inProgressCount = ideas.filter(idea => idea.status === 'approved' || idea.status === 'drafted').length;
  const readyToPublishCount = ideas.filter(idea => idea.status === 'ready_to_publish').length;
  const publishedCount = ideas.filter(idea => idea.status === 'published').length;
  
  // Calculate weekly stats
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const previousWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  const previousWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
  
  const isInCurrentWeek = (date: Date) => {
    return date >= currentWeekStart && date <= currentWeekEnd;
  };
  
  const isInPreviousWeek = (date: Date) => {
    return date >= previousWeekStart && date <= previousWeekEnd;
  };
  
  const ideasCreatedCurrentWeek = ideas.filter(idea => isInCurrentWeek(new Date(idea.createdAt))).length;
  const ideasCreatedPreviousWeek = ideas.filter(idea => isInPreviousWeek(new Date(idea.createdAt))).length;
  
  const draftsGeneratedCurrentWeek = drafts.filter(draft => isInCurrentWeek(new Date(draft.createdAt))).length;
  const draftsGeneratedPreviousWeek = drafts.filter(draft => isInPreviousWeek(new Date(draft.createdAt))).length;
  
  const contentPublishedCurrentWeek = ideas.filter(idea => 
    idea.status === 'published' && isInCurrentWeek(new Date(idea.createdAt))
  ).length;
  const contentPublishedPreviousWeek = ideas.filter(idea => 
    idea.status === 'published' && isInPreviousWeek(new Date(idea.createdAt))
  ).length;
  
  // Generate activity feed
  useEffect(() => {
    if (isIdeasLoading || isDraftsLoading) return;
    
    setIsActivityLoading(true);
    
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
    setIsActivityLoading(false);
  }, [ideas, drafts, isIdeasLoading, isDraftsLoading]);
  
  return {
    statusCounts: {
      needsReview: needsReviewCount,
      inProgress: inProgressCount,
      readyToPublish: readyToPublishCount,
      published: publishedCount
    },
    weeklyStats: {
      ideasCreated: {
        current: ideasCreatedCurrentWeek,
        previous: ideasCreatedPreviousWeek
      },
      draftsGenerated: {
        current: draftsGeneratedCurrentWeek,
        previous: draftsGeneratedPreviousWeek
      },
      contentPublished: {
        current: contentPublishedCurrentWeek,
        previous: contentPublishedPreviousWeek
      }
    },
    activities,
    isLoading: {
      ideas: isIdeasLoading,
      drafts: isDraftsLoading,
      activities: isActivityLoading
    }
  };
}
