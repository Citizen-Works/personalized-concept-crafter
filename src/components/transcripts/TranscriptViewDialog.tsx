
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TranscriptViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}

const TranscriptViewDialog: React.FC<TranscriptViewDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transcript Content</DialogTitle>
          <DialogDescription>
            View the full transcript content below
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-sm">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptViewDialog;
