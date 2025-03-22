
import { useState, useMemo, useCallback } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { useIdeas } from '@/hooks/ideas';

interface UseIdeasListProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const useIdeasList = ({
  searchQuery,
  dateRange,
  contentTypeFilter
}: UseIdeasListProps) => {
  const { ideas, isLoading, deleteIdea } = useIdeas();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'unused-first'>('unused-first'); // Default to showing unused first
  
  // Filter ideas based on search, date range, and content type
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(idea => 
        idea.title.toLowerCase().includes(query) ||
        (idea.description && idea.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by date range
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);
      
      result = result.filter(idea => {
        const createdAt = new Date(idea.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      });
    }
    
    // Filter by content type - this is commented out since ContentIdea no longer has a content type field
    // if (contentTypeFilter && contentTypeFilter !== "all") {
    //   result = result.filter(idea => idea.contentType === contentTypeFilter);
    // }
    
    // Important: Filter out rejected ideas in the pipeline view
    result = result.filter(idea => idea.status !== 'rejected');
    
    return result;
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  // Sort ideas based on selected sort order
  const sortedIdeas = useMemo(() => {
    let sorted = [...filteredIdeas];
    
    switch (sortOrder) {
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'unused-first':
        return sorted.sort((a, b) => {
          // First sort by hasBeenUsed status (unused first)
          if (a.hasBeenUsed !== b.hasBeenUsed) {
            return a.hasBeenUsed ? 1 : -1;
          }
          // Then by creation date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      case 'newest':
      default:
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [filteredIdeas, sortOrder]);
  
  // Toggle selection for a single item
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);
  
  // Toggle selection for all filtered items
  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === sortedIdeas.length) {
      // If all are selected, deselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all filtered ideas
      setSelectedItems(sortedIdeas.map(idea => idea.id));
    }
  }, [sortedIdeas, selectedItems]);
  
  // Handle deleting confirmed items
  const handleDeleteConfirm = useCallback(async () => {
    try {
      setIsDeleting(true);
      
      // If a specific item is being deleted
      if (itemToDelete) {
        console.log("Deleting specific item:", itemToDelete);
        await deleteIdea(itemToDelete);
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
      } 
      // If batch delete is being performed
      else if (selectedItems.length > 0) {
        console.log("Deleting multiple items:", selectedItems);
        // Currently, we delete items one by one
        for (const id of selectedItems) {
          await deleteIdea(id);
        }
        setSelectedItems([]);
      }
    } catch (error) {
      console.error('Error deleting ideas:', error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  }, [deleteIdea, itemToDelete, selectedItems]);
  
  return {
    ideas,
    filteredIdeas,
    sortedIdeas,
    selectedItems,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    itemToDelete,
    setItemToDelete,
    sortOrder,
    setSortOrder,
    isLoading,
    isDeleting,
    handleToggleSelect,
    handleSelectAll,
    handleDeleteConfirm,
  };
};
