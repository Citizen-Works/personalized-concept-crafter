
import { useState } from 'react';
import { ContentIdea, ContentStatus } from '@/types';
import { toast } from "sonner";

interface UseItemActionsProps {
  updateIdea: (params: { id: string } & any) => Promise<ContentIdea>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  previewItem: string | null;
  setPreviewItem: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Custom hook for handling idea actions (approve, archive)
 */
export const useItemActions = ({ 
  updateIdea, 
  selectedItems,
  setSelectedItems,
  previewItem,
  setPreviewItem
}: UseItemActionsProps) => {
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
  
  return {
    isUpdating,
    handleApprove,
    handleArchive
  };
};
