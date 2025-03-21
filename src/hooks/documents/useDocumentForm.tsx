
import { useState } from "react";
import { Document, DocumentType, DocumentPurpose, DocumentContentType } from "@/types";
import { useDocuments } from "@/hooks/useDocuments";

export interface DocumentFormData {
  title: string;
  content: string;
  type: DocumentType;
  purpose: DocumentPurpose;
  contentType: DocumentContentType;
  file: File | null;
  inputMethod: "upload" | "manual";
}

export const useDocumentForm = (onClose: () => void) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<DocumentType>("blog");
  const [purpose, setPurpose] = useState<DocumentPurpose>("business_context");
  const [contentType, setContentType] = useState<DocumentContentType>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<"upload" | "manual">("manual");
  
  const { uploadDocument, createDocument, uploadProgress } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.split(".")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const documentData = {
      title,
      type,
      purpose,
      content_type: contentType,
      status: 'active' as const
    };

    try {
      if (inputMethod === "upload" && file) {
        await uploadDocument({ 
          file, 
          documentData
        });
      } else {
        await createDocument({
          ...documentData,
          content
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("blog");
    setPurpose("business_context");
    setContentType(null);
    setFile(null);
    setInputMethod("manual");
  };

  return {
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
    setFile,
    inputMethod,
    setInputMethod,
    uploadProgress,
    handleFileChange,
    handleSubmit,
    resetForm
  };
};
