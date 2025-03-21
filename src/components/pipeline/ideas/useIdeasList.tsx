
import { useState, useMemo } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';

interface UseIdeasListProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const useIdeasList = ({ searchQuery, dateRange, contentTypeFilter }: UseIdeasListProps) => {
  const { ideas, isLoading, deleteIdea } = useIdeas();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  
  // Filter ideas based on search, date range, and content type
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Filter to only show approved ideas (not unreviewed)
      if (idea.status !== 'approved') return false;
      
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
      
      // Filter by content type
      if (contentTypeFilter !== "all" && idea.contentType !== contentTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  // Sort filtered ideas
  const sortedIdeas = useMemo(() => {
    return [...filteredIdeas].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredIdeas, sortOrder]);
  
  // Handle toggle select for a single item
  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === sortedIdeas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedIdeas.map(idea => idea.id));
    }
  };
  
  // Handle delete idea
  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id);
      toast.success("Content idea deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete content idea");
    }
  };
  
  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      const promises = selectedItems.map(id => deleteIdea(id));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items deleted`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch deleting ideas:", error);
      toast.error("Failed to delete selected items");
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
    } else {
      handleBatchDelete();
    }
  };

  return {
    isLoading,
    sortedIdeas,
    selectedItems,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    itemToDelete,
    setItemToDelete,
    sortOrder,
    setSortOrder,
    handleToggleSelect,
    handleSelectAll,
    handleDeleteConfirm,
  };
};
