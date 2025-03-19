
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  hasTranscribedText: boolean;
  isTranscribing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  hasTranscribedText,
  isTranscribing,
  isSubmitting,
  onCancel,
  onSave
}) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isTranscribing || isSubmitting}
      >
        Cancel
      </Button>
      
      {hasTranscribedText && (
        <Button 
          onClick={onSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Transcript"}
        </Button>
      )}
    </DialogFooter>
  );
};

export default DialogActions;
