
import { useMemo } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { ContentIdea } from '@/types';
import { 
  useFilteredIdeas, 
  useItemActions, 
  useBatchActions, 
  useSelectionManagement 
} from './hooks';

interface UseReviewQueueProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: any;
}

export const useReviewQueue = ({ searchQuery, dateRange, contentTypeFilter }: UseReviewQueueProps) => {
  const { ideas, isLoading, updateIdea, deleteIdea } = useIdeas();
  
  // Use custom hooks to break down functionality
  const { 
    selectedItems, 
    setSelectedItems, 
    previewItem, 
    setPreviewItem, 
    handleToggleSelect, 
    handleSelectAll: baseHandleSelectAll 
  } = useSelectionManagement();
  
  // Filter ideas
  const filteredIdeas = useFilteredIdeas({ 
    ideas, 
    searchQuery, 
    dateRange, 
    contentTypeFilter 
  });
  
  // Handle individual item actions
  const { 
    isUpdating: itemActionsUpdating, 
    deleteConfirmOpen, 
    itemToDelete, 
    handleApprove, 
    handleArchive, 
    handleDelete, 
    handleConfirmDelete, 
    setDeleteConfirmOpen, 
    setItemToDelete 
  } = useItemActions({ 
    updateIdea, 
    deleteIdea, 
    selectedItems, 
    setSelectedItems, 
    previewItem, 
    setPreviewItem 
  });
  
  // Handle batch actions
  const { 
    isUpdating: batchActionsUpdating, 
    handleBatchApprove, 
    handleBatchArchive 
  } = useBatchActions({ 
    selectedItems, 
    updateIdea, 
    setSelectedItems 
  });
  
  // Get preview idea
  const previewIdea = useMemo(() => {
    if (!previewItem) return null;
    return ideas.find(idea => idea.id === previewItem) || null;
  }, [previewItem, ideas]);
  
  // Wrapper for handleSelectAll that provides filteredIdeas
  const handleSelectAll = () => {
    baseHandleSelectAll(filteredIdeas.map(idea => idea.id));
  };
  
  // Determine if any update is in progress
  const isUpdating = itemActionsUpdating || batchActionsUpdating;

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
