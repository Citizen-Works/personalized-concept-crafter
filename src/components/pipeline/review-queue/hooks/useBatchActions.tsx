
import { useState } from 'react';
import { ContentStatus } from '@/types';
import { toast } from "sonner";

interface UseBatchActionsProps {
  selectedItems: string[];
  updateIdea: (params: { id: string } & any) => Promise<any>;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Custom hook for handling batch actions on multiple items
 */
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
  
  // Handle batch reject
  const handleBatchReject = async () => {
    if (isUpdating || selectedItems.length === 0) return;
    
    try {
      setIsUpdating(true);
      const promises = selectedItems.map(id => updateIdea({ 
        id, 
        status: 'rejected' as ContentStatus 
      }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} items rejected`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch rejecting ideas:", error);
      toast.error("Failed to reject selected items");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    isUpdating,
    handleBatchApprove,
    handleBatchReject
  };
};
