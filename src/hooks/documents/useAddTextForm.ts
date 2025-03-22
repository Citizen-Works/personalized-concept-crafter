
import { useState } from 'react';
import { DocumentType, DocumentPurpose, DocumentContentType } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

/**
 * Hook for managing the Add Text form functionality
 * 
 * Handles form state, validation, and submission of text documents
 * to the document service.
 * 
 * @param onSuccess Callback function called when document is successfully added
 * @param onClose Callback function to close the dialog
 * @returns Form state and handler functions
 */
export function useAddTextForm(onSuccess: () => void, onClose: () => void) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<DocumentType>("other");
  const [purpose, setPurpose] = useState<DocumentPurpose>("business_context");
  const [showContentTypeField, setShowContentTypeField] = useState(false);
  const [contentType, setContentType] = useState<DocumentContentType>(null);
  
  const { createDocumentAsync, refetch } = useDocuments();

  /**
   * Handles the submission of a new text document
   */
  const handleAddText = async () => {
    // Validate required fields
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
      
      console.log("Submitting text with data:", {
        title: title.trim(),
        content: content.trim(),
        type,
        purpose,
        contentType
      });
      
      // Create the document
      const result = await createDocumentAsync({
        title: title.trim(),
        content: content.trim(),
        type,
        purpose,
        status: "active",
        content_type: contentType,
      });
      
      console.log("Document created:", result);
      
      toast.success("Text added successfully");
      
      // Force a refetch of documents to update the list
      await refetch();
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding text:", error);
      setError("Failed to add text. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles closing the form and resetting state
   */
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

  /**
   * Handles purpose change and shows/hides content type field based on selection
   */
  const handlePurposeChange = (value: string) => {
    setPurpose(value as DocumentPurpose);
    // Show content type field only for writing samples
    setShowContentTypeField(value === "writing_sample");
    if (value !== "writing_sample") {
      setContentType(null);
    }
  };
  
  /**
   * Handles content type change
   */
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
