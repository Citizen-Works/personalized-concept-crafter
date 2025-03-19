
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { fetchDocuments, createDocument, updateDocumentStatus, processTranscriptForIdeas } from "@/services/documentService";
import { useDocumentUpload } from "./documents/useDocumentUpload";

export const useDocuments = (filters?: {
  type?: Document["type"],
  status?: Document["status"],
  content_type?: Document["content_type"]
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { uploadDocument, uploadProgress } = useDocumentUpload(user?.id);

  const documentsQuery = useQuery({
    queryKey: ["documents", user?.id, filters],
    queryFn: () => fetchDocuments(user?.id || "", filters),
    enabled: !!user,
  });

  const createDocumentMutation = useMutation({
    mutationFn: (document: Omit<Document, "id" | "userId" | "createdAt">) => 
      createDocument(user?.id || "", document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id, filters] });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, documentData }: { 
      file: File; 
      documentData: Omit<Document, "id" | "userId" | "content" | "createdAt"> 
    }) => uploadDocument(file, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id, filters] });
    },
  });

  const updateDocumentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'archived' }) => 
      updateDocumentStatus(user?.id || "", id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", user?.id, filters] });
    },
  });

  const processTranscriptMutation = useMutation({
    mutationFn: (documentId: string) => processTranscriptForIdeas(user?.id || "", documentId),
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    createDocument: createDocumentMutation.mutate,
    uploadDocument: uploadDocumentMutation.mutate,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    processTranscript: processTranscriptMutation.mutateAsync,
    uploadProgress,
  };
};
