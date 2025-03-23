
import { Document } from '@/types';
import { DocumentCreateInput, DocumentUpdateInput } from './types';
import { useCreateDocument } from './createOperation';
import { useUpdateDocument } from './updateOperation';
import { useDeleteDocument } from './deleteOperation';

/**
 * Hook for document mutation operations
 */
export const useDocumentMutations = () => {
  const { createDocument, createDocumentMutation } = useCreateDocument();
  const { updateDocument, updateDocumentMutation } = useUpdateDocument();
  const { deleteDocument, deleteDocumentMutation } = useDeleteDocument();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createDocumentMutation.isPending || 
    updateDocumentMutation.isPending || 
    deleteDocumentMutation.isPending;

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    isLoading
  };
};
