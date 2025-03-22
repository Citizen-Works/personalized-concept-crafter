
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import type { DocumentType, DocumentPurpose } from '@/types';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<DocumentType>("other");
  const [purpose, setPurpose] = useState<DocumentPurpose>("business_context");
  
  const { uploadDocument } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Use the file name (without extension) as the default title if no title is set
      if (!title) {
        const fileName = selectedFile.name.split('.')[0];
        setTitle(fileName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Call the uploadDocument function with the file and document data
      await uploadDocument(file, {
        title: title.trim(),
        type, // Use the selected document type
        purpose, // Use the selected purpose
        content_type: null,
        status: "active"
      });
      
      toast.success("Document uploaded successfully");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setFile(null);
      setError(null);
      setType("other");
      setPurpose("business_context");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a file to add as a document
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
              placeholder="Document title" 
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
                <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="purpose">Document Purpose</Label>
            <Select value={purpose} onValueChange={(value) => setPurpose(value as DocumentPurpose)}>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select document purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_context">Business Context</SelectItem>
                <SelectItem value="writing_sample">Writing Sample</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="file">File</Label>
            <Input 
              id="file" 
              type="file" 
              onChange={handleFileChange} 
              className="cursor-pointer" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: .txt, .md, .doc, .docx, .pdf
            </p>
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
            onClick={handleUpload}
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
