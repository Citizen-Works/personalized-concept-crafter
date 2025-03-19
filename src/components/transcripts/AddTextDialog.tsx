
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddText = async () => {
    if (!content.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onAddText(content, title || "Text");
      handleClose();
    } catch (error) {
      console.error("Error adding text:", error);
      // Error is already handled in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Paste or type text content to add as a transcript
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Text title" 
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Paste or type text here" 
              className="min-h-[200px]" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddText}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Adding..." : "Add Text"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextDialog;
