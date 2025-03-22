
import React from 'react';
import { ContentIdea } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

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
  
  const handleApprove = () => {
    if (previewIdea) {
      onApprove(previewIdea.id);
    }
  };
  
  const handleArchive = () => {
    if (previewIdea) {
      onArchive(previewIdea.id);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{previewIdea.title}</DialogTitle>
          <DialogDescription>
            {previewIdea.source && (
              <span className="text-muted-foreground">
                From {previewIdea.source} • {formatDistanceToNow(new Date(previewIdea.createdAt), { addSuffix: true })}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {previewIdea.description && (
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {previewIdea.description}
              </p>
            </div>
          )}
          
          {previewIdea.notes && (
            <div>
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {previewIdea.notes}
              </p>
            </div>
          )}
          
          {previewIdea.meetingTranscriptExcerpt && (
            <div>
              <h3 className="font-semibold mb-1">Meeting Transcript Excerpt</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                <p className="italic text-gray-700 dark:text-gray-300">
                  "{previewIdea.meetingTranscriptExcerpt}"
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleArchive}
            disabled={isUpdating}
            className="gap-1"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            Reject
          </Button>
          <Button 
            variant="default" 
            onClick={handleApprove}
            disabled={isUpdating}
            className="gap-1"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
