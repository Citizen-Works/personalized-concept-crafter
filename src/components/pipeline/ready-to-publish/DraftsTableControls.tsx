
import React from 'react';
import { ChevronDown, Check, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DraftsTableControlsProps {
  selectedItemsCount: number;
  totalItemsCount: number;
  onSelectAll: () => void;
  onBatchMarkAsReady: () => void;
  onBatchDeleteRequest: () => void;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  onSortChange: (sort: 'newest' | 'oldest' | 'alphabetical') => void;
}

export const DraftsTableControls: React.FC<DraftsTableControlsProps> = ({
  selectedItemsCount,
  totalItemsCount,
  onSelectAll,
  onBatchMarkAsReady,
  onBatchDeleteRequest,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <Checkbox 
          id="select-all-drafts" 
          checked={totalItemsCount > 0 && selectedItemsCount === totalItemsCount}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all-drafts" className="text-sm font-medium ml-2 cursor-pointer">
          Select All
        </label>
      </div>
      
      <div className="flex gap-2">
        {selectedItemsCount > 0 && (
          <>
            <Button 
              variant="default" 
              size="sm"
              onClick={onBatchMarkAsReady}
            >
              <Check className="h-4 w-4 mr-1" />
              Mark Selected as Ready
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onBatchDeleteRequest}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange('newest')}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('oldest')}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
