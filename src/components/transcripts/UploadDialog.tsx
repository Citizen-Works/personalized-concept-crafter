
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
import { toast } from 'sonner';
import UploadDropzone from '@/components/documents/UploadDropzone';
import UploadProgress from '@/components/documents/UploadProgress';
import { AlertCircle } from 'lucide-react';

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadTitle(selectedFile.name.split('.')[0]);
      setUploadError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setUploadError(null);
    
    // Declare interval variable outside the try/catch block so it's accessible in both
    let progressInterval: NodeJS.Timeout | undefined;
    
    try {
      setIsSubmitting(true);
      setUploadProgress(10);
      
      // Simulate progress for better UX
      progressInterval = setInterval(() => {
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
      // Clear the interval if it exists
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(0);
      
      // Display error message to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadError(errorMessage);
      
      // Only show toast for generic errors, specific ones will be shown in the dialog
      if (!errorMessage.includes('parsing') && !errorMessage.includes('library')) {
        toast.error("Failed to upload document");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setUploadTitle("");
      setFile(null);
      setUploadProgress(0);
      setUploadError(null);
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
          
          {uploadError && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error uploading document</p>
                <p>{uploadError}</p>
                <p className="mt-1 text-xs">Try using a plain text (.txt) file instead.</p>
              </div>
            </div>
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
