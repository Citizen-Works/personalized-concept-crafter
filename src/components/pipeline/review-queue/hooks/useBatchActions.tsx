
import { useState } from 'react';
import { toast } from 'sonner';
import { ContentStatus } from '@/types';

interface UseBatchActionsProps {
  selectedItems: string[];
  updateIdea: (params: { id: string } & any) => Promise<any>;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useBatchActions = ({
  selectedItems,
  updateIdea,
  setSelectedItems
}: UseBatchActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle batch approve
  const handleBatchApprove = async () => {
    if (isUpdating || selectedItems.length === 0) return;
    
    try {
      setIsUpdating(true);
      
      // Process items in sequence to avoid race conditions
      for (const id of selectedItems) {
        await updateIdea({ id, status: 'approved' as ContentStatus });
      }
      
      toast.success(`${selectedItems.length} items approved`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error in batch approve:", error);
      toast.error("Failed to approve items");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle batch archive - using 'archived' status instead of 'rejected'
  const handleBatchArchive = async () => {
    if (isUpdating || selectedItems.length === 0) return;
    
    try {
      setIsUpdating(true);
      
      // Process items in sequence to avoid race conditions
      for (const id of selectedItems) {
        await updateIdea({ id, status: 'archived' as ContentStatus });
      }
      
      toast.success(`${selectedItems.length} items rejected`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error in batch archive:", error);
      toast.error("Failed to reject items");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    isUpdating,
    handleBatchApprove,
    handleBatchArchive
  };
};
