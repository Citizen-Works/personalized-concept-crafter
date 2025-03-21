
import React, { useState, useEffect } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Document } from '@/types';
import { toast } from 'sonner';
import { useDocuments } from '@/hooks/useDocuments';

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState<Document["purpose"]>("writing_sample");
  const [type, setType] = useState<Document["type"]>("blog");
  const [contentType, setContentType] = useState<Document["content_type"]>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateDocument } = useDocuments();

  // Reset form when dialog opens with new document
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setPurpose(document.purpose);
      setType(document.type);
      setContentType(document.content_type);
    }
  }, [document, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) return;
    
    try {
      setIsSubmitting(true);
      
      await updateDocument({
        id: document.id,
        title,
        purpose,
        type,
        content_type: contentType,
      });
      
      toast.success("Document updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update document properties
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="purpose">Document Purpose</Label>
            <Select 
              value={purpose} 
              onValueChange={(value) => setPurpose(value as Document["purpose"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="writing_sample">Writing Sample</SelectItem>
                <SelectItem value="business_context">Business Context</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Document Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as Document["type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {purpose === "writing_sample" && (
            <div>
              <Label htmlFor="content_type">Content Application</Label>
              <Select
                value={contentType || undefined}
                onValueChange={(value) => 
                  setContentType(value === "null" ? null : value as Document["content_type"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select where this writing style applies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="general">General (All Content)</SelectItem>
                  <SelectItem value="null">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
