
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BatchActionsProps {
  selectedItems: string[];
  isUpdating: boolean;
}

export const BatchActions: React.FC<BatchActionsProps> = ({ 
  selectedItems, 
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
          <Button variant="destructive" size="sm" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Trash className="h-4 w-4 mr-1" />
            )}
            Delete All
          </Button>
        </div>
      </div>
      
      {isUpdating && (
        <Progress value={progressValue} className="h-2" />
      )}
    </div>
  );
};
