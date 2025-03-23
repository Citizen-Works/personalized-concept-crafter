
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDocumentsApi } from '../useDocumentsApi';
import { Document } from '@/types';
import { DocumentCreateInput, DocumentUpdateInput } from '../documents/types';

/**
 * Adapter hook that provides the same interface as the original useDocuments hook
 * but uses the new standardized API pattern under the hood
 */
export const useDocumentsAdapter = () => {
  const documentsApi = useDocumentsApi();
  
  // Get all documents query
  const documentsQuery = documentsApi.fetchDocuments();
  
  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: (document: DocumentCreateInput) => {
      return documentsApi.createDocument(document);
    }
  });
  
  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: (params: { id: string, updates: DocumentUpdateInput }) => {
      return documentsApi.updateDocument(params.id, params.updates);
    }
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => {
      return documentsApi.deleteDocument(id);
    }
  });
  
  // Custom hook for getting a single document
  const getDocument = (id: string) => {
    return useQuery({
      queryKey: ['document', id],
      queryFn: () => documentsApi.fetchDocumentById(id).refetch().then(result => result.data)
    });
  };
  
  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    getDocument,
    createDocument: createDocumentMutation.mutate,
    createDocumentAsync: createDocumentMutation.mutateAsync,
    updateDocument: updateDocumentMutation.mutate,
    updateDocumentAsync: updateDocumentMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutate
  };
};
