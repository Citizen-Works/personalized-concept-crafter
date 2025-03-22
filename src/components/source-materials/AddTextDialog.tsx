
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DocumentType, DocumentPurpose, DocumentContentType } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

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
  const [type, setType] = useState<DocumentType>("other");
  const [purpose, setPurpose] = useState<DocumentPurpose>("business_context");
  const [showContentTypeField, setShowContentTypeField] = useState(false);
  const [contentType, setContentType] = useState<DocumentContentType>(null);
  
  const { createDocument } = useDocuments();

  const handleAddText = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }
    
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Create the document
      await createDocument({
        title: title.trim(),
        content: content.trim(),
        type, // Use the selected document type
        purpose, // Use the selected purpose
        status: "active",
        content_type: contentType,
      });
      
      toast.success("Text added successfully");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding text:", error);
      setError("Failed to add text. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setType("other");
      setPurpose("business_context");
      setContentType(null);
      setShowContentTypeField(false);
      setError(null);
      onOpenChange(false);
    }
  };

  // Handle purpose change
  const handlePurposeChange = (value: string) => {
    setPurpose(value as DocumentPurpose);
    // Show content type field only for writing samples
    setShowContentTypeField(value === "writing_sample");
    if (value !== "writing_sample") {
      setContentType(null);
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
            <Label htmlFor="document_type">Document Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as DocumentType)}>
              <SelectTrigger id="document_type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="purpose">Document Purpose</Label>
            <Select value={purpose} onValueChange={handlePurposeChange}>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select document purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_context">Business Context</SelectItem>
                <SelectItem value="writing_sample">Writing Sample</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showContentTypeField && (
            <div>
              <Label htmlFor="content_type">Content Application</Label>
              <Select 
                value={contentType || ""} 
                onValueChange={(value) => setContentType(value === "" ? null : value as DocumentContentType)}
              >
                <SelectTrigger id="content_type">
                  <SelectValue placeholder="Select where this writing style applies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="general">General (All Content)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
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
            disabled={isSubmitting || !content.trim() || !title.trim()}
          >
            {isSubmitting ? "Adding..." : "Add Text"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextDialog;
