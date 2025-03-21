
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Document, DocumentCreateInput } from '@/types';
import { toast } from 'sonner';
import { uploadFile } from '@/services/documents/baseDocumentService';

export const useDocumentUpload = (userId?: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, path }: { file: File, path: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Report progress during upload
      const onProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      return await uploadFile(userId, file, path, onProgress);
    }
  });

  const uploadDocument = useCallback(async (
    file: File, 
    documentData: Omit<DocumentCreateInput, 'content'>
  ): Promise<Document> => {
    if (!userId) throw new Error("User not authenticated");
    
    try {
      setUploadProgress(0);
      
      // Create a file path based on user ID and filename
      const path = `documents/${userId}/${Date.now()}_${file.name}`;
      
      // Upload the file
      const fileUrl = await uploadFileMutation.mutateAsync({ file, path });
      
      // Create document record with file URL
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...documentData,
          file_url: fileUrl,
          user_id: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create document record');
      }
      
      const document = await response.json();
      toast.success('Document uploaded successfully');
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    } finally {
      setUploadProgress(0);
    }
  }, [userId, uploadFileMutation]);

  return {
    uploadDocument,
    uploadProgress,
    isUploading: uploadFileMutation.isPending
  };
};
