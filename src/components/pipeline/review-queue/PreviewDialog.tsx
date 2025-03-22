
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentIdea } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Loader2 } from "lucide-react";

interface PreviewDialogProps {
  previewIdea: ContentIdea | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  isUpdating: boolean;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  previewIdea,
  isOpen,
  onClose,
  onApprove,
  onArchive,
  isUpdating
}) => {
  if (!previewIdea) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{previewIdea.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Created {formatDistanceToNow(new Date(previewIdea.createdAt), { addSuffix: true })}
            </p>
            <p className="text-base">{previewIdea.description}</p>
          </div>
          
          {previewIdea.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Notes</h4>
              <p className="text-sm">{previewIdea.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onArchive(previewIdea.id)}
            disabled={isUpdating}
            className="gap-2"
          >
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button 
            onClick={() => onApprove(previewIdea.id)}
            disabled={isUpdating}
            className="gap-2"
          >
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
