
import { useState } from "react";
import { toast } from "sonner";
import { Document } from "@/types";
import { parseDocumentContent } from "@/utils/documentUtils";
import { createDocument } from "@/services/documents"; // Updated import path

export const useDocumentUpload = (userId: string | undefined) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadDocument = async (file: File, documentData: Omit<Document, "id" | "userId" | "content" | "createdAt">) => {
    if (!userId) throw new Error("User not authenticated");
    
    try {
      setUploadProgress(10);
      
      const content = await parseDocumentContent(file);
      setUploadProgress(50);
      
      const document = await createDocument(userId, {
        ...documentData,
        content
      });
      
      setUploadProgress(100);
      toast.success(`Document "${documentData.title}" uploaded successfully`);
      return document;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      throw error;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadDocument,
    uploadProgress
  };
};
