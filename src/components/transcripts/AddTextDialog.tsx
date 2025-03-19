
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface AddTextDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddText: (text: string, title: string) => Promise<void>;
}

const AddTextDialog: React.FC<AddTextDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddText,
}) => {
  const [manualText, setManualText] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddText = async () => {
    if (!manualText) {
      toast.error("Please enter text content");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onAddText(manualText, manualTitle || "New Text");
      onOpenChange(false);
      setManualTitle("");
      setManualText("");
    } catch (error) {
      console.error("Error adding text:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Add text content to extract ideas from
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text-title">Title</Label>
            <Input 
              id="text-title" 
              value={manualTitle} 
              onChange={(e) => setManualTitle(e.target.value)} 
              placeholder="Text title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text-content">Content</Label>
            <Textarea 
              id="text-content" 
              value={manualText} 
              onChange={(e) => setManualText(e.target.value)} 
              placeholder="Enter or paste your text here..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddText}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Text"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextDialog;
