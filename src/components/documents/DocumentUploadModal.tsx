
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DocumentUploadForm from "./DocumentUploadForm";
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

        <DocumentUploadForm
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
          file={file}
          inputMethod={inputMethod}
          setInputMethod={setInputMethod}
          uploadProgress={uploadProgress}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
