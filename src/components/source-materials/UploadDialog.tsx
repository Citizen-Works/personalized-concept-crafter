
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentType } from "@/types";
import { FileUp, Loader2 } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("document");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { uploadDocument } = useDocuments();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    // Auto-set title from filename if no title is set yet
    if (selectedFile && !title) {
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setTitle(fileName);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }
    
    if (!title.trim()) {
      setUploadError("Please enter a title for this document.");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await uploadDocument({
        file,
        title: title.trim(),
        type: documentType,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setTitle("");
      setDocumentType("document");
      setUploadError(null);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to your source materials library
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".txt,.pdf,.doc,.docx,.md"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: .txt, .pdf, .doc, .docx, .md
            </p>
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for this document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
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
          
          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
