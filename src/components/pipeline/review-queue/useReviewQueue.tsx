
import { useState, useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { ContentIdea, ContentType, ContentStatus } from '@/types';
import { toast } from "sonner";

interface UseReviewQueueProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const useReviewQueue = ({ searchQuery, dateRange, contentTypeFilter }: UseReviewQueueProps) => {
  const { ideas, isLoading, updateIdea, deleteIdea } = useIdeas();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter ideas based on search, date range, and content type
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Filter by status
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
      
      // Filter by content type
      if (contentTypeFilter !== "all" && idea.contentType !== contentTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [ideas, searchQuery, dateRange, contentTypeFilter]);
  
  // Get preview idea
  const previewIdea = useMemo(() => {
    if (!previewItem) return null;
    return ideas.find(idea => idea.id === previewItem) || null;
  }, [previewItem, ideas]);
  
  // Handle toggle select
  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredIdeas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredIdeas.map(idea => idea.id));
    }
  };
  
  // Handle approve idea
  const handleApprove = async (id: string) => {
    if (isUpdating) return; // Prevent multiple requests
    
    try {
      setIsUpdating(true);
      await updateIdea({ id, status: 'approved' as ContentStatus });
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      }
      
      // Close preview if this item was being previewed
      if (previewItem === id) {
        setPreviewItem(null);
      }
      
      toast.success("Content idea approved");
    } catch (error) {
      console.error("Error approving idea:", error);
      toast.error("Failed to approve content idea");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle archive idea
  const handleArchive = async (id: string) => {
    if (isUpdating) return; // Prevent multiple requests
    
    try {
      setIsUpdating(true);
      await updateIdea({ 
        id, 
        status: 'archived' as ContentStatus 
      });
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      }
      
      // Close preview if this item was being previewed
      if (previewItem === id) {
        setPreviewItem(null);
      }
      
      toast.success("Content idea archived");
    } catch (error) {
      console.error("Error archiving idea:", error);
      toast.error("Failed to archive content idea");
      return; // Exit early to prevent further processing
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle delete idea
  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete || isUpdating) return;
    
    try {
      setIsUpdating(true);
      await deleteIdea(itemToDelete);
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(itemToDelete)) {
        setSelectedItems(prev => prev.filter(itemId => itemId !== itemToDelete));
      }
      
      // Close preview if this item was being previewed
      if (previewItem === itemToDelete) {
        setPreviewItem(null);
      }
      
      toast.success("Content idea deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete content idea");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle batch approve
  const handleBatchApprove = async () => {
    if (isUpdating || selectedItems.length === 0) return;
    
    try {
      setIsUpdating(true);
      const promises = selectedItems.map(id => updateIdea({ id, status: 'approved' as ContentStatus }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items approved`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch approving ideas:", error);
      toast.error("Failed to approve selected items");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle batch archive
  const handleBatchArchive = async () => {
    if (isUpdating || selectedItems.length === 0) return;
    
    try {
      setIsUpdating(true);
      const promises = selectedItems.map(id => updateIdea({ 
        id, 
        status: 'archived' as ContentStatus 
      }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items archived`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch archiving ideas:", error);
      toast.error("Failed to archive selected items");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    filteredIdeas,
    isLoading,
    isUpdating,
    selectedItems,
    previewIdea,
    previewItem,
    deleteConfirmOpen,
    itemToDelete,
    handleToggleSelect,
    handleSelectAll,
    handleApprove,
    handleArchive,
    handleDelete,
    handleConfirmDelete,
    handleBatchApprove,
    handleBatchArchive,
    setPreviewItem,
    setDeleteConfirmOpen,
    setItemToDelete
  };
};
