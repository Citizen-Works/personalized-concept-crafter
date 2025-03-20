
import { useState, useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { ContentIdea, ContentType } from '@/types';
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
    try {
      await updateIdea({ id, status: 'approved' });
      toast.success("Content idea approved");
    } catch (error) {
      console.error("Error approving idea:", error);
      toast.error("Failed to approve content idea");
    }
  };
  
  // Handle archive idea
  const handleArchive = async (id: string) => {
    try {
      await updateIdea({ id, status: 'archived' });
      toast.success("Content idea archived");
    } catch (error) {
      console.error("Error archiving idea:", error);
      toast.error("Failed to archive content idea");
    }
  };
  
  // Handle delete idea
  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteIdea(itemToDelete);
      toast.success("Content idea deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete content idea");
    }
  };
  
  // Handle batch approve
  const handleBatchApprove = async () => {
    try {
      const promises = selectedItems.map(id => updateIdea({ id, status: 'approved' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items approved`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch approving ideas:", error);
      toast.error("Failed to approve selected items");
    }
  };
  
  // Handle batch archive
  const handleBatchArchive = async () => {
    try {
      const promises = selectedItems.map(id => updateIdea({ id, status: 'archived' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items archived`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch archiving ideas:", error);
      toast.error("Failed to archive selected items");
    }
  };

  return {
    filteredIdeas,
    isLoading,
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
