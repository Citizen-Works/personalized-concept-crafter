
import { useState } from 'react';
import { ContentStatus } from '@/types';
import { toast } from 'sonner';

interface UseItemActionsProps {
  updateIdea: (params: { id: string } & any) => Promise<any>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  previewItem: string | null;
  setPreviewItem: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useItemActions = ({
  updateIdea,
  selectedItems,
  setSelectedItems,
  previewItem,
  setPreviewItem
}: UseItemActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle approve action
  const handleApprove = async (id: string) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateIdea({ id, status: 'approved' as ContentStatus });
      toast.success("Item approved");
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(item => item !== id));
      }
      
      // Close preview if this was the item being previewed
      if (previewItem === id) {
        setPreviewItem(null);
      }
    } catch (error) {
      console.error("Error approving idea:", error);
      toast.error("Failed to approve item");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle archive action - using 'rejected' status
  const handleArchive = async (id: string) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateIdea({ id, status: 'rejected' as ContentStatus });
      toast.success("Item rejected");
      
      // Remove from selected items if it was selected
      if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(item => item !== id));
      }
      
      // Close preview if this was the item being previewed
      if (previewItem === id) {
        setPreviewItem(null);
      }
    } catch (error) {
      console.error("Error rejecting idea:", error);
      toast.error("Failed to reject item");
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
