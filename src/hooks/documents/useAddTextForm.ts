
import { useState } from 'react';
import { DocumentType, DocumentPurpose, DocumentContentType } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

export function useAddTextForm(onSuccess: () => void, onClose: () => void) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<DocumentType>("other");
  const [purpose, setPurpose] = useState<DocumentPurpose>("business_context");
  const [showContentTypeField, setShowContentTypeField] = useState(false);
  const [contentType, setContentType] = useState<DocumentContentType>(null);
  
  const { createDocument } = useDocuments();

  const handleAddText = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }
    
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Create the document
      await createDocument({
        title: title.trim(),
        content: content.trim(),
        type,
        purpose,
        status: "active",
        content_type: contentType,
      });
      
      toast.success("Text added successfully");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding text:", error);
      setError("Failed to add text. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setType("other");
      setPurpose("business_context");
      setContentType(null);
      setShowContentTypeField(false);
      setError(null);
      onClose();
    }
  };

  // Handle purpose change
  const handlePurposeChange = (value: string) => {
    setPurpose(value as DocumentPurpose);
    // Show content type field only for writing samples
    setShowContentTypeField(value === "writing_sample");
    if (value !== "writing_sample") {
      setContentType(null);
    }
  };
  
  // Handle content type change
  const handleContentTypeChange = (value: string) => {
    setContentType(value === "" ? null : value as DocumentContentType);
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    error,
    type,
    setType,
    purpose,
    handlePurposeChange,
    showContentTypeField,
    contentType,
    handleContentTypeChange,
    handleAddText,
    handleClose
  };
}
