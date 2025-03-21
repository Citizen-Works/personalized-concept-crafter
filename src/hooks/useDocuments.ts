
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { Document, DocumentFilterOptions, DocumentCreateInput } from '@/types';
import { 
  fetchDocuments, 
  createDocument, 
  updateDocumentStatus,
  updateDocument, 
  getDocumentById as fetchDocument
} from '@/services/documents/baseDocumentService';
import { processTranscriptForIdeas } from '@/services/documents/transcript/processTranscript';
import { toast } from 'sonner';
import { useDocumentUpload } from './documents/useDocumentUpload';

export const useDocuments = (filters?: DocumentFilterOptions) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [processingDocumentIds, setProcessingDocumentIds] = useState<string[]>([]);
  const { uploadDocument, uploadProgress } = useDocumentUpload(user?.id);

  // Query documents
  const { 
    data = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['documents', filters, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await fetchDocuments(user.id, filters);
    },
    enabled: !!user?.id,
  });

  // Fetch a single document by ID
  const fetchSingleDocument = useCallback(async (id: string) => {
    if (!user?.id) throw new Error("User not authenticated");
    return await fetchDocument(user.id, id);
  }, [user?.id]);

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (newDocument: DocumentCreateInput) => {
      if (!user?.id) throw new Error("User not authenticated");
      return await createDocument(user.id, newDocument);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Update document status mutation
  const updateDocumentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'archived' }) => {
      if (!user?.id) throw new Error("User not authenticated");
      await updateDocumentStatus(user.id, id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (docUpdates: Parameters<typeof updateDocument>[1]) => {
      if (!user?.id) throw new Error("User not authenticated");
      await updateDocument(user.id, docUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Process transcript for ideas
  const processTranscript = useCallback(async (documentId: string) => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setProcessingDocumentIds(prev => [...prev, documentId]);
    
    try {
      const result = await processTranscriptForIdeas(user.id, documentId, true);
      
      if (result.ideas.length === 0) {
        toast.info("No content ideas found in this transcript");
      } else {
        toast.success(`Found ${result.ideas.length} content ideas`);
      }
      
      return result;
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.error("Failed to process transcript");
      throw error;
    } finally {
      setProcessingDocumentIds(prev => prev.filter(id => id !== documentId));
    }
  }, [user?.id]);

  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((documentId: string) => {
    return processingDocumentIds.includes(documentId);
  }, [processingDocumentIds]);

  return {
    documents: data,
    isLoading,
    error,
    refetch,
    fetchDocument: fetchSingleDocument,
    createDocument: createDocumentMutation.mutate,
    createDocumentAsync: createDocumentMutation.mutateAsync,
    isCreating: createDocumentMutation.isPending,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    isUpdatingStatus: updateDocumentStatusMutation.isPending,
    updateDocument: updateDocumentMutation.mutateAsync,
    isUpdating: updateDocumentMutation.isPending,
    processTranscript,
    processingDocuments: processingDocumentIds,
    isDocumentProcessing,
    uploadDocument,
    uploadProgress
  };
};
