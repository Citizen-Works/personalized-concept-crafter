
import { useState } from 'react';

/**
 * Custom hook for managing selection of items
 */
export const useSelectionManagement = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  
  // Handle toggle select
  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const handleSelectAll = (itemIds: string[]) => {
    if (selectedItems.length === itemIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemIds);
    }
  };
  
  return {
    selectedItems,
    setSelectedItems,
    previewItem,
    setPreviewItem,
    handleToggleSelect,
    handleSelectAll
  };
};
