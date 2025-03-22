
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';

type DailyCount = {
  day: string;
  ideas: number;
  drafts: number;
  published: number;
};

export function useWeeklyStats() {
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  
  const weeklyStats = useMemo(() => {
    // Define the current week interval
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Create array of days in the current week
    const days = eachDayOfInterval({ start, end });
    
    // Initialize counts for each day
    const dailyCounts: DailyCount[] = days.map(day => ({
      day: format(day, 'EEE'),
      ideas: 0,
      drafts: 0,
      published: 0
    }));
    
    // Count ideas created per day
    ideas.forEach(idea => {
      const createdAt = new Date(idea.createdAt);
      if (createdAt >= start && createdAt <= end) {
        const dayIndex = days.findIndex(day => isSameDay(day, createdAt));
        if (dayIndex !== -1) {
          // We can no longer check for 'published' as ContentIdea no longer has this status
          // Instead we just count all ideas
          dailyCounts[dayIndex].ideas += 1;
        }
      }
    });
    
    // Count drafts created per day and published content
    drafts.forEach(draft => {
      const createdAt = new Date(draft.createdAt);
      if (createdAt >= start && createdAt <= end) {
        const dayIndex = days.findIndex(day => isSameDay(day, createdAt));
        if (dayIndex !== -1) {
          if (draft.status === 'published') {
            dailyCounts[dayIndex].published += 1;
          } else {
            dailyCounts[dayIndex].drafts += 1;
          }
        }
      }
    });
    
    // Calculate totals for the week
    const ideasCreated = dailyCounts.reduce((sum, day) => sum + day.ideas, 0);
    const draftsGenerated = dailyCounts.reduce((sum, day) => sum + day.drafts, 0);
    const contentPublished = dailyCounts.reduce((sum, day) => sum + day.published, 0);
    
    return {
      dailyCounts,
      ideasCreated,
      draftsGenerated,
      contentPublished
    };
  }, [ideas, drafts]);
  
  return {
    weeklyStats,
    isLoading: isIdeasLoading || isDraftsLoading
  };
}
