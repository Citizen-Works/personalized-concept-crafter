
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Plus, Trash } from 'lucide-react';

interface IdeasListHeaderProps {
  selectedItems: string[];
  sortedIdeasLength: number;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onChangeSortOrder: (order: 'newest' | 'oldest' | 'alphabetical') => void;
}

export const IdeasListHeader: React.FC<IdeasListHeaderProps> = ({
  selectedItems,
  sortedIdeasLength,
  sortOrder,
  onToggleSelectAll,
  onDeleteSelected,
  onChangeSortOrder
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <Checkbox 
          id="select-all" 
          checked={sortedIdeasLength > 0 && selectedItems.length === sortedIdeasLength}
          onCheckedChange={onToggleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium ml-2 cursor-pointer">
          Select All
        </label>
      </div>
      
      <div className="flex gap-2">
        {selectedItems.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDeleteSelected}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChangeSortOrder('newest')}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeSortOrder('oldest')}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeSortOrder('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button asChild>
          <Link to="/ideas/new">
            <Plus className="h-4 w-4 mr-1" />
            New Idea
          </Link>
        </Button>
      </div>
    </div>
  );
};
