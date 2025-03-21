import { useCallback } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { DocumentType } from '@/types';

export const useTranscriptUpload = () => {
  const { createDocument, uploadDocument } = useDocuments();

  const handleUploadDocument = useCallback(async (file: File, title: string) => {
    try {
      // Using "transcript" type to match database constraints
      const documentData = {
        title: title,
        type: "transcript" as DocumentType,
        purpose: "business_context" as const,
        content_type: null,
        status: "active" as const
      };
      
      await uploadDocument(file, documentData);
      toast.success("Transcript uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      throw error;
    }
  }, [uploadDocument]);
  
  const handleAddText = useCallback(async (text: string, title: string) => {
    if (!text.trim()) {
      toast.error("Text content cannot be empty");
      throw new Error("Text content cannot be empty");
    }
    
    try {
      await createDocument({
        title: title,
        content: text,
        type: "transcript" as DocumentType,
        purpose: "business_context" as const,
        content_type: null,
        status: "active" as const
      });
      
      toast.success("Text added successfully");
    } catch (error) {
      console.error("Error adding text:", error);
      toast.error("Failed to add text");
      throw error;
    }
  }, [createDocument]);

  const handleAddRecording = useCallback(async (text: string, title: string): Promise<void> => {
    if (!text.trim()) {
      toast.error("Recorded text cannot be empty");
      throw new Error("Recorded text cannot be empty");
    }
    
    try {
      await handleAddText(text, title);
      toast.success("Recording transcript added successfully");
    } catch (error) {
      console.error("Error adding recording:", error);
      toast.error("Failed to add recording transcript");
      throw error;
    }
  }, [handleAddText]);

  return {
    handleUploadDocument,
    handleAddText,
    handleAddRecording
  };
};
