
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface IdeasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ideas: string | null;
}

const IdeasDialog: React.FC<IdeasDialogProps> = ({
  isOpen,
  onOpenChange,
  ideas,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generated Content Ideas</DialogTitle>
          <DialogDescription>
            Here are the content ideas extracted from your transcript
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-sm">
          {ideas}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeasDialog;
