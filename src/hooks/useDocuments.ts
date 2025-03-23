
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useTranscriptsApi } from './api/useTranscriptsApi';
import { useDocumentsApi } from './api/useDocumentsApi'; 
import { Document, DocumentType, DocumentStatus } from '@/types';
import { toast } from 'sonner';

/**
 * Hook for managing document operations
 */
export function useDocuments() {
  const { user } = useAuth();
  const { 
    fetchTranscripts, 
    createTranscript, 
    updateTranscript, 
    deleteTranscript,
    processTranscript: processTranscriptApi,
    isLoading: isTranscriptsLoading 
  } = useTranscriptsApi();

  const {
    fetchDocuments,
    createDocument,
    updateDocument: updateDocumentApi,
    deleteDocument,
    isLoading: isDocumentsLoading
  } = useDocumentsApi();

  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Upload a new document (transcript)
   */
  const uploadDocument = async (file: File, documentData: any) => {
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    try {
      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Read the file content
      const content = await readFileAsText(file);
      
      // Create the document
      const result = await createDocument({
        title: documentData.title,
        content,
        type: documentData.type as DocumentType, 
        purpose: documentData.purpose,
        contentType: documentData.content_type,
        metadata: documentData.metadata || {}
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Document uploaded successfully");
      return result;
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadProgress(0);
      toast.error("Failed to upload document");
      throw error;
    }
  };

  /**
   * Helper function to read file content
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
   * Process a document to extract ideas
   */
  const processTranscript = useCallback(async (documentId: string): Promise<boolean> => {
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    if (processingIds.includes(documentId)) {
      console.log(`Document ${documentId} is already being processed`);
      return false;
    }

    try {
      setProcessingIds(prev => [...prev, documentId]);
      
      await processTranscriptApi(documentId);
      
      return true;
    } catch (error) {
      console.error("Error processing document:", error);
      return false;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== documentId));
    }
  }, [user, processingIds, processTranscriptApi]);

  /**
   * Update document status
   */
  const updateDocumentStatus = async (document: {id: string, status: DocumentStatus}) => {
    try {
      await updateDocumentApi(document.id, { status: document.status });
      toast.success(`Document ${document.status === 'archived' ? 'archived' : 'restored'} successfully`);
      return true;
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error(`Failed to ${document.status === 'archived' ? 'archive' : 'restore'} document`);
      return false;
    }
  };

  // For backward compatibility, implement methods that other components expect
  const refetch = () => {
    if (fetchDocuments && typeof fetchDocuments === 'object' && fetchDocuments.refetch) {
      return fetchDocuments.refetch();
    }
    return Promise.resolve(null);
  };

  const createDocumentAsync = async (data: any) => {
    return createDocument(data);
  };

  // Get document by ID
  const fetchDocument = (id: string) => {
    const docs = fetchDocuments && typeof fetchDocuments === 'object' && fetchDocuments.data 
      ? fetchDocuments.data 
      : [];
    const doc = docs.find(d => d.id === id);
    return doc || null;
  };

  // For backward compatibility with existing components
  const error = fetchDocuments && typeof fetchDocuments === 'object' && fetchDocuments.error 
    ? fetchDocuments.error 
    : null;
  const documents = fetchDocuments && typeof fetchDocuments === 'object' && fetchDocuments.data 
    ? fetchDocuments.data 
    : [];
  const isLoading = isTranscriptsLoading || isDocumentsLoading;
  const isProcessing = processingIds.length > 0;
  const isDocumentProcessing = useCallback((documentId: string) => {
    return processingIds.includes(documentId);
  }, [processingIds]);

  return {
    documents,
    isLoading,
    isProcessing,
    error,
    uploadDocument,
    uploadProgress,
    processTranscript,
    isDocumentProcessing,
    refetch,
    createDocument,
    createDocumentAsync,
    updateDocument: updateDocumentApi,
    updateDocumentStatus,
    fetchDocument
  };
}
