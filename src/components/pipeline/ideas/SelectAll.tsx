
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface SelectAllProps {
  hasItems: boolean;
  allSelected: boolean;
  onSelectAll: () => void;
  isDisabled?: boolean;
}

export const SelectAll: React.FC<SelectAllProps> = ({ 
  hasItems, 
  allSelected, 
  onSelectAll,
  isDisabled = false
}) => {
  if (!hasItems) return null;
  
  return (
    <div className="flex items-center mb-2">
      <Checkbox 
        id="select-all" 
        checked={allSelected}
        onCheckedChange={onSelectAll}
        disabled={isDisabled}
      />
      <label 
        htmlFor="select-all" 
        className={`text-sm font-medium ml-2 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        Select All
      </label>
    </div>
  );
};
