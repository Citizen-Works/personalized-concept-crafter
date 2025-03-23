
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useTranscriptsApi } from './api/useTranscriptsApi';
import { Document } from '@/types';

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
    processTranscript,
    isLoading 
  } = useTranscriptsApi();

  const [processingIds, setProcessingIds] = useState<string[]>([]);

  /**
   * Upload a new document (transcript)
   */
  const uploadDocument = async (title: string, content: string, type = 'transcript') => {
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    try {
      return await createTranscript({
        title,
        content,
        type: type as any, // Type assertion for compatibility
        purpose: 'business_context'
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  };

  /**
   * Process a document to extract ideas
   */
  const processDocumentForIdeas = useCallback(async (documentId: string): Promise<boolean> => {
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
      
      await processTranscript(documentId);
      
      return true;
    } catch (error) {
      console.error("Error processing document:", error);
      return false;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== documentId));
    }
  }, [user, processingIds, processTranscript]);

  const documents = fetchTranscripts.data || [];
  const isDocumentProcessing = useCallback((documentId: string) => {
    return processingIds.includes(documentId);
  }, [processingIds]);

  return {
    documents,
    isLoading,
    isProcessing: processingIds.length > 0,
    uploadDocument,
    processTranscript: processDocumentForIdeas,
    isDocumentProcessing
  };
}
