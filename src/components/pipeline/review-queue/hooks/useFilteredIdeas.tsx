
import { useMemo } from 'react';
import { ContentIdea, ContentType } from '@/types';

interface UseFilteredIdeasProps {
  ideas: ContentIdea[];
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const useFilteredIdeas = ({ 
  ideas, 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}: UseFilteredIdeasProps) => {
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Only include unreviewed ideas, exclude rejected ideas
      if (idea.status !== 'unreviewed') return false;
      
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
      
      // Skip content type filtering since content_type is now on drafts, not ideas
      // We'll need to join with drafts table if we want to filter by content type
      // For now, we're just returning all ideas when a content type filter is set
      
      return true;
    });
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  return filteredIdeas;
};
