
import { useMemo } from 'react';
import { ContentIdea, ContentType } from '@/types';

interface UseFilteredIdeasProps {
  ideas: ContentIdea[];
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

/**
 * Custom hook to filter ideas based on search query, date range, and content type
 */
export const useFilteredIdeas = ({ 
  ideas, 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}: UseFilteredIdeasProps) => {
  // Filter ideas based on search, date range
  return useMemo(() => {
    return ideas.filter(idea => {
      // Filter by status - only show unreviewed items
      if (idea.status !== 'unreviewed') {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !idea.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      const ideaDate = new Date(idea.createdAt);
      if (dateRange[0] && ideaDate < dateRange[0]) return false;
      if (dateRange[1]) {
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (ideaDate > endDate) return false;
      }
      
      return true;
    });
  }, [ideas, searchQuery, dateRange]);
};
