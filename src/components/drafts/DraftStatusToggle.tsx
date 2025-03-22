
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DraftStatus } from '@/types';
import { Badge } from "@/components/ui/badge";
import { validateDraftStatusChange } from '@/utils/statusValidation';
import { getDraftStatusClasses } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

interface DraftStatusToggleProps {
  status: DraftStatus;
  onStatusChange: (status: DraftStatus) => void;
  showBadge?: boolean;
  disabled?: boolean;
}

export const DraftStatusToggle = ({ 
  status, 
  onStatusChange, 
  showBadge = false,
  disabled = false
}: DraftStatusToggleProps) => {
  const [isChanging, setIsChanging] = useState(false);
  
  const handleStatusChange = (newStatus: string) => {
    // Validate the status transition
    const validation = validateDraftStatusChange(
      status,
      newStatus as DraftStatus
    );
    
    if (!validation.isValid) {
      toast.error(validation.errorMessage || 'Invalid status change');
      return;
    }
    
    setIsChanging(true);
    
    // Call the parent's handler
    try {
      onStatusChange(newStatus as DraftStatus);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsChanging(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Status:</span>
      {showBadge && (
        <Badge className={getDraftStatusClasses(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )}
      <Select 
        value={status} 
        onValueChange={handleStatusChange}
        disabled={disabled || isChanging}
      >
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
