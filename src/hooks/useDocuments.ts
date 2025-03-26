import { useState, useCallback, useEffect } from 'react';
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

  // Initialize the documents query
  const documentsQuery = fetchDocuments();
  
  // Log when documents change
  useEffect(() => {
    console.log('Documents query state:', {
      data: documentsQuery.data,
      isLoading: documentsQuery.isPending,
      error: documentsQuery.error
    });
  }, [documentsQuery.data, documentsQuery.isPending, documentsQuery.error]);

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
      
      // Force a refetch after creating a document
      if (documentsQuery.refetch) {
        console.log('Refetching documents after upload');
        await documentsQuery.refetch();
      }
      
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
      
      // Force a refetch after processing
      if (documentsQuery.refetch) {
        console.log('Refetching documents after processing');
        await documentsQuery.refetch();
      }
      
      return true;
    } catch (error) {
      console.error("Error processing document:", error);
      return false;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== documentId));
    }
  }, [user, processingIds, processTranscriptApi, documentsQuery]);

  /**
   * Update document status
   */
  const updateDocumentStatus = async (document: {id: string, status: DocumentStatus}) => {
    try {
      await updateDocumentApi(document.id, { status: document.status });
      
      // Force a refetch after updating status
      if (documentsQuery.refetch) {
        console.log('Refetching documents after status update');
        await documentsQuery.refetch();
      }
      
      toast.success(`Document ${document.status === 'archived' ? 'archived' : 'restored'} successfully`);
      return true;
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error(`Failed to ${document.status === 'archived' ? 'archive' : 'restore'} document`);
      return false;
    }
  };

  // Refetch documents
  const refetch = async () => {
    if (documentsQuery.refetch) {
      console.log('Manual refetch of documents requested');
      return documentsQuery.refetch();
    }
    return Promise.resolve(null);
  };

  const createDocumentAsync = async (data: any) => {
    const result = await createDocument(data);
    // Force a refetch after creating a document
    if (documentsQuery.refetch) {
      console.log('Refetching documents after creation');
      await documentsQuery.refetch();
    }
    return result;
  };

  // Get document by ID
  const fetchDocument = (id: string) => {
    if (!documentsQuery.data) {
      return null;
    }
    
    return documentsQuery.data.find(d => d.id === id) || null;
  };

  const isLoading = isTranscriptsLoading || isDocumentsLoading || documentsQuery.isPending;
  const isProcessing = processingIds.length > 0;
  const isDocumentProcessing = useCallback((documentId: string) => {
    return processingIds.includes(documentId);
  }, [processingIds]);

  return {
    documents: documentsQuery.data || [],
    isLoading,
    isProcessing,
    error: documentsQuery.error,
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
