
import React, { useRef, useState } from 'react';
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
import { toast } from 'sonner';
import UploadDropzone from '@/components/documents/UploadDropzone';
import UploadProgress from '@/components/documents/UploadProgress';

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, title: string) => Promise<void>;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onOpenChange,
  onUpload,
}) => {
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadTitle(selectedFile.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(10);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      await onUpload(file, uploadTitle || file.name.split('.')[0]);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Success will be handled in the service
      onOpenChange(false);
      setUploadTitle("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading document:", error);
      // Error toast is shown in the service level, no need to show it here
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setUploadTitle("");
      setFile(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Transcript</DialogTitle>
          <DialogDescription>
            Upload a transcript document to extract content ideas
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <UploadDropzone
            file={file}
            onFileChange={handleFileChange}
            acceptedFileTypes=".txt,.md,.doc,.docx,.pdf"
          />
          
          {uploadProgress > 0 && (
            <UploadProgress value={uploadProgress} />
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={uploadTitle} 
              onChange={(e) => setUploadTitle(e.target.value)} 
              placeholder="Document title"
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
