
import { useState } from 'react';
import { ContentIdea, ContentStatus } from '@/types';
import { toast } from "sonner";

interface UseItemActionsProps {
  updateIdea: (params: { id: string } & any) => Promise<ContentIdea>;
  deleteIdea: (id: string) => void | Promise<void>;  // Updated type to accept both void and Promise<void>
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  previewItem: string | null;
  setPreviewItem: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Custom hook for handling idea actions (approve, archive, reject, delete)
 */
export const useItemActions = ({ 
  updateIdea, 
  deleteIdea,
  selectedItems,
  setSelectedItems,
  previewItem,
  setPreviewItem
}: UseItemActionsProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  // Handle reject idea (which now means archive with reject notification)
  const handleReject = async (id: string) => {
    if (isUpdating) return; // Prevent multiple requests
    
    try {
      setIsUpdating(true);
      await updateIdea({ 
        id, 
        status: 'archived' as ContentStatus, 
        rejectionReason: 'Rejected during review'  // Add metadata for rejection
      });
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      }
      
      // Close preview if this item was being previewed
      if (previewItem === id) {
        setPreviewItem(null);
      }
      
      toast.success("Content idea rejected");
    } catch (error) {
      console.error("Error rejecting idea:", error);
      toast.error("Failed to reject content idea");
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
      // Call deleteIdea and handle both void and Promise<void> return types
      const result = deleteIdea(itemToDelete);
      if (result instanceof Promise) {
        await result;
      }
      
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
  
  return {
    isUpdating,
    deleteConfirmOpen,
    itemToDelete,
    handleApprove,
    handleArchive,
    handleReject,
    handleDelete,
    handleConfirmDelete,
    setDeleteConfirmOpen,
    setItemToDelete
  };
};
