
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface SelectAllProps {
  hasItems: boolean;
  allSelected: boolean;
  onSelectAll: () => void;
}

export const SelectAll: React.FC<SelectAllProps> = ({ 
  hasItems, 
  allSelected, 
  onSelectAll 
}) => {
  if (!hasItems) return null;
  
  return (
    <div className="flex items-center mb-2">
      <Checkbox 
        id="select-all" 
        checked={allSelected}
        onCheckedChange={onSelectAll}
      />
      <label htmlFor="select-all" className="text-sm font-medium ml-2 cursor-pointer">
        Select All
      </label>
    </div>
  );
};
