
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Ban, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BatchActionsProps {
  selectedItems: string[];
  onBatchApprove: () => Promise<void>;
  onBatchArchive: () => Promise<void>;
  onBatchReject: () => Promise<void>;
  isUpdating: boolean;
}

export const BatchActions: React.FC<BatchActionsProps> = ({ 
  selectedItems, 
  onBatchApprove, 
  onBatchArchive,
  onBatchReject,
  isUpdating
}) => {
  if (selectedItems.length === 0) return null;
  
  // Calculate progress for batch operations (simplified for visual purposes)
  const progressValue = isUpdating ? 70 : 0;
  
  return (
    <div className="bg-muted/30 p-3 rounded-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{selectedItems.length} items selected</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={onBatchApprove} disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Approve All
          </Button>
          <Button size="sm" variant="outline" onClick={onBatchArchive} disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            Archive All
          </Button>
          <Button size="sm" variant="outline" onClick={onBatchReject} disabled={isUpdating} className="text-destructive">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Ban className="h-4 w-4 mr-1" />
            )}
            Reject All
          </Button>
        </div>
      </div>
      
      {isUpdating && (
        <Progress value={progressValue} className="h-2" />
      )}
    </div>
  );
};
