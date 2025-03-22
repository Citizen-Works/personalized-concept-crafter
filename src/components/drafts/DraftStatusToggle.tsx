
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DraftStatus } from '@/types/content';

interface DraftStatusToggleProps {
  status: DraftStatus;
  onStatusChange: (status: DraftStatus) => void;
}

export const DraftStatusToggle = ({ status, onStatusChange }: DraftStatusToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Status:</span>
      <Select value={status} onValueChange={(value) => onStatusChange(value as DraftStatus)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
