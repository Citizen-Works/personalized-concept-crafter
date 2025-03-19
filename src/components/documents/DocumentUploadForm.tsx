
import React from "react";
import { Button } from "@/components/ui/button";
import InputMethodSelector from "./InputMethodSelector";
import DocumentFormFields from "./DocumentFormFields";
import FileUploadField from "./FileUploadField";
import { Document } from "@/types";

interface DocumentUploadFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  type: Document["type"];
  setType: (type: Document["type"]) => void;
  purpose: Document["purpose"];
  setPurpose: (purpose: Document["purpose"]) => void;
  contentType: Document["content_type"];
  setContentType: (contentType: Document["content_type"]) => void;
  file: File | null;
  inputMethod: "upload" | "manual";
  setInputMethod: (method: "upload" | "manual") => void;
  uploadProgress: number;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
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
  handleSubmit,
  onCancel
}) => {
  return (
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

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto sm:ml-2">
          {inputMethod === "upload" ? "Upload" : "Save"} Document
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadForm;
