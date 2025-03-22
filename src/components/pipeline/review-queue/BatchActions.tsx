
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";

interface BatchActionsProps {
  selectedItems: string[];
  onBatchApprove: () => Promise<void>;
  onBatchReject: () => Promise<void>;
  isUpdating: boolean;
}

export const BatchActions: React.FC<BatchActionsProps> = ({
  selectedItems,
  onBatchApprove,
  onBatchReject,
  isUpdating
}) => {
  const hasSelectedItems = selectedItems.length > 0;
  
  return (
    <Card className={`p-4 transition-opacity ${hasSelectedItems ? 'opacity-100' : 'opacity-50'}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {hasSelectedItems ? (
            <span className="font-medium">{selectedItems.length} items selected</span>
          ) : (
            <span className="text-muted-foreground">No items selected</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            disabled={!hasSelectedItems || isUpdating}
            onClick={onBatchApprove}
            className="gap-2"
          >
            {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
            <Check className="h-4 w-4 mr-1" />
            Approve All
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelectedItems || isUpdating}
            onClick={onBatchReject}
            className="gap-2"
          >
            {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
            <X className="h-4 w-4 mr-1" />
            Reject All
          </Button>
        </div>
      </div>
    </Card>
  );
};
