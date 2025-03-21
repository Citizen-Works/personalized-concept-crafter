
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentType } from "@/types";
import { Loader2, Save, FileText } from "lucide-react";

interface AddTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddTextDialog: React.FC<AddTextDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("document");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addTextDocument } = useDocuments();
  
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a title for this document.");
      return;
    }
    
    if (!content.trim()) {
      setError("Please enter content for this document.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addTextDocument({
        title: title.trim(),
        content: content.trim(),
        type: documentType,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Adding text failed:", error);
      setError("Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setDocumentType("document");
      setError(null);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Text Material</DialogTitle>
          <DialogDescription>
            Add text content directly to your source materials library
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for this document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="type">Material Type</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter document content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
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
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
