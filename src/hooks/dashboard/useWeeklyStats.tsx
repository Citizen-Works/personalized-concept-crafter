
import { useMemo } from 'react';
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';

export interface WeeklyStatsData {
  ideasCreated: {
    current: number;
    previous: number;
  };
  draftsGenerated: {
    current: number;
    previous: number;
  };
  contentPublished: {
    current: number;
    previous: number;
  };
}

export function useWeeklyStats() {
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  
  const weeklyStats = useMemo(() => {
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
    
    return {
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
    };
  }, [ideas, drafts]);
  
  return {
    weeklyStats,
    isLoading: isIdeasLoading || isDraftsLoading
  };
}
