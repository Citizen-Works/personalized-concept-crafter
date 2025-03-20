
import React from 'react';
import { ContentIdea } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PreviewDialogProps {
  previewIdea: ContentIdea | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  previewIdea,
  isOpen,
  onClose,
  onApprove,
  onArchive
}) => {
  if (!previewIdea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{previewIdea.title}</DialogTitle>
          <DialogDescription>
            Created {formatDistanceToNow(new Date(previewIdea.createdAt), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{previewIdea.description || "No description provided"}</p>
          </div>
          
          {previewIdea.meetingTranscriptExcerpt && (
            <div>
              <h4 className="text-sm font-medium mb-1">Meeting Transcript Excerpt</h4>
              <div className="bg-muted p-3 rounded-md text-sm">
                {previewIdea.meetingTranscriptExcerpt}
              </div>
            </div>
          )}
          
          {previewIdea.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Notes</h4>
              <p className="text-sm">{previewIdea.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="default" 
              onClick={() => {
                onApprove(previewIdea.id);
                onClose();
              }}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                onArchive(previewIdea.id);
                onClose();
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Archive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
