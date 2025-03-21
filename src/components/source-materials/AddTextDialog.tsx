
import React, { useState } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentType } from '@/types';

interface AddTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddTextDialog: React.FC<AddTextDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use a string literal type that matches valid DocumentType values
  const [type, setType] = useState<DocumentType>("document" as DocumentType);

  const handleAddText = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      // Handle text addition logic
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding text:", error);
      setError("Failed to add text. Please try again.");
      // Error is already handled in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Paste or type text content to add as a document
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
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
