
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, DocumentCreateInput, DocumentFilterOptions } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchDocuments, 
  createDocument, 
  updateDocumentStatus, 
  processTranscriptForIdeas,
  IdeaResponse 
} from "@/services/documents"; // Updated import path with IdeaResponse type
import { useDocumentUpload } from "./documents/useDocumentUpload";
import { useMemo, useCallback } from "react";

/**
 * Hook for managing document operations with optimized performance
 */
export const useDocuments = (filters?: DocumentFilterOptions) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { uploadDocument, uploadProgress } = useDocumentUpload(user?.id);
  
  // Query key that includes all filter parameters for proper cache invalidation
  const queryKey = useMemo(() => ["documents", user?.id, filters], [user?.id, filters]);

  // Query for fetching documents with caching
  const documentsQuery = useQuery({
    queryKey,
    queryFn: () => fetchDocuments(user?.id || "", filters),
    enabled: !!user,
  });

  // Mutation for creating documents
  const createDocumentMutation = useMutation({
    mutationFn: (document: DocumentCreateInput) => 
      createDocument(user?.id || "", document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation for uploading documents
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, documentData }: { 
      file: File; 
      documentData: Omit<DocumentCreateInput, "content"> 
    }) => uploadDocument(file, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation for updating document status
  const updateDocumentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'archived' }) => 
      updateDocumentStatus(user?.id || "", id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation for processing transcripts
  const processTranscriptMutation = useMutation({
    mutationFn: (params: { documentId: string; backgroundMode?: boolean }) => 
      processTranscriptForIdeas(
        user?.id || "", 
        params.documentId, 
        params.backgroundMode
      ),
  });

  // Memoized create function to prevent unnecessary rerenders
  const createDocumentCallback = useCallback((document: DocumentCreateInput) => {
    createDocumentMutation.mutate(document);
  }, [createDocumentMutation]);
  
  // Memoized upload function
  const uploadDocumentCallback = useCallback(({ file, documentData }: { 
    file: File; 
    documentData: Omit<DocumentCreateInput, "content"> 
  }) => {
    uploadDocumentMutation.mutate({ file, documentData });
  }, [uploadDocumentMutation]);
  
  // Memoized status update function
  const updateDocumentStatusCallback = useCallback(({ id, status }: { 
    id: string; 
    status: 'active' | 'archived' 
  }) => {
    updateDocumentStatusMutation.mutate({ id, status });
  }, [updateDocumentStatusMutation]);

  // Process transcript with optional background mode
  const processTranscriptCallback = useCallback((
    documentId: string, 
    backgroundMode: boolean = false
  ) => {
    return processTranscriptMutation.mutateAsync({ 
      documentId, 
      backgroundMode 
    });
  }, [processTranscriptMutation]);

  // Return memoized value to prevent downstream rerenders
  return useMemo(() => ({
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    createDocument: createDocumentCallback,
    uploadDocument: uploadDocumentCallback,
    updateDocumentStatus: updateDocumentStatusCallback,
    processTranscript: processTranscriptCallback,
    uploadProgress,
  }), [
    documentsQuery.data,
    documentsQuery.isLoading,
    documentsQuery.isError,
    createDocumentCallback,
    uploadDocumentCallback,
    updateDocumentStatusCallback,
    processTranscriptCallback,
    uploadProgress
  ]);
};
