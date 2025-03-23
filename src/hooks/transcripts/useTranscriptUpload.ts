
import { useState } from 'react';
import { useTranscriptsApi } from '@/hooks/api/useTranscriptsApi';
import { Document, DocumentType } from '@/types';
import { toast } from 'sonner';

/**
 * Hook for managing transcript upload functionality
 */
export function useTranscriptUpload() {
  const { createTranscript } = useTranscriptsApi();
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle file upload
   */
  const handleUploadDocument = async (file: File, title: string): Promise<Document | null> => {
    try {
      setIsUploading(true);
      
      // Read the file content
      const content = await readFileAsText(file);
      
      // Create the transcript
      const document = await createTranscript({
        title,
        content,
        type: 'transcript' as DocumentType
      });
      
      toast.success("Document uploaded successfully");
      return document;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Read file as text
   */
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  /**
   * Handle adding text
   */
  const handleAddText = async (title: string, content: string): Promise<Document | null> => {
    try {
      // Create the transcript
      const document = await createTranscript({
        title,
        content,
        type: 'transcript' as DocumentType
      });
      
      toast.success("Text added successfully");
      return document;
    } catch (error) {
      console.error("Error adding text:", error);
      toast.error("Failed to add text");
      return null;
    }
  };

  /**
   * Handle adding a recording
   */
  const handleAddRecording = async (title: string, audioBlob: Blob): Promise<Document | null> => {
    try {
      // Convert the audio blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Create the transcript with audio metadata
      const document = await createTranscript({
        title,
        content: "Audio recording - awaiting transcription",
        type: 'transcript' as DocumentType,
        isEncrypted: false
      });
      
      toast.success("Recording added successfully");
      return document;
    } catch (error) {
      console.error("Error adding recording:", error);
      toast.error("Failed to add recording");
      return null;
    }
  };

  /**
   * Convert blob to base64
   */
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return {
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    isUploading
  };
}
