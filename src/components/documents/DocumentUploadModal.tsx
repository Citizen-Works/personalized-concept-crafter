
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputMethodSelector from "./InputMethodSelector";
import DocumentFormFields from "./DocumentFormFields";
import FileUploadField from "./FileUploadField";
import { useDocumentForm } from "@/hooks/documents/useDocumentForm";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    type,
    setType,
    purpose,
    setPurpose,
    contentType,
    setContentType,
    file,
    inputMethod,
    setInputMethod,
    uploadProgress,
    handleFileChange,
    handleSubmit
  } = useDocumentForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inputMethod === "upload" ? "Upload Document" : "Create Document"}</DialogTitle>
          <DialogDescription>
            {inputMethod === "upload" 
              ? "Upload a document to extract text and store it for AI content generation." 
              : "Manually create a document to store text for AI content generation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputMethodSelector 
            inputMethod={inputMethod} 
            setInputMethod={setInputMethod} 
          />

          <DocumentFormFields
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            type={type}
            setType={setType}
            purpose={purpose}
            setPurpose={setPurpose}
            contentType={contentType}
            setContentType={setContentType}
            inputMethod={inputMethod}
          />

          {inputMethod === "upload" && (
            <FileUploadField
              file={file}
              uploadProgress={uploadProgress}
              onFileChange={handleFileChange}
            />
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {inputMethod === "upload" ? "Upload" : "Save"} Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
