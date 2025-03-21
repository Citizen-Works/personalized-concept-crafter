
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
import type { DocumentType } from '@/types';

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
  // Use a string literal type that matches valid DocumentType values
  const [type, setType] = useState<DocumentType>("document" as DocumentType);

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
    
    try {
      setError(null);
      setIsSubmitting(true);
      // Handle upload logic
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      // Error is already handled in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setFile(null);
      setError(null);
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
