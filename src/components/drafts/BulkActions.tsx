
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash, CheckCircle, Archive } from 'lucide-react';
import { DraftStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange: (status: DraftStatus) => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedCount, 
  onDelete, 
  onStatusChange 
}) => {
  return (
    <div className="flex items-center justify-between bg-muted/50 border rounded-md p-3">
      <div className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? 'draft' : 'drafts'} selected
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange('draft')}>
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              <span>Mark as Draft</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('published')}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>Mark as Published</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('archived')}>
              <Archive className="h-4 w-4 mr-2 text-amber-500" />
              <span>Archive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
