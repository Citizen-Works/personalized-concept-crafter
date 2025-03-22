
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
      
      // Apply content type filter if specified
      if (contentTypeFilter !== "all") {
        // Looking at the ContentIdea type definition, there's no contentType property
        // Instead, we should check for the relevant property if it exists in the future
        // For now, we'll skip this filter since the property doesn't exist
        // TODO: Update this when contentType is added to ContentIdea type
        // return false if no contentType match
      }
      
      return true;
    });
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  return filteredIdeas;
};
