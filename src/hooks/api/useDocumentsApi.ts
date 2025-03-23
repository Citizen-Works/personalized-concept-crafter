
import { Document } from '@/types';
import { useFetchDocuments } from './documents/fetchOperations';
import { useDocumentMutations } from './documents/mutationOperations';
import { DocumentCreateInput, DocumentUpdateInput } from './documents/types';

/**
 * Hook for standardized Document API operations
 */
export function useDocumentsApi() {
  const { fetchDocuments, fetchDocumentById } = useFetchDocuments();
  const { 
    createDocument, 
    updateDocument, 
    deleteDocument, 
    isLoading 
  } = useDocumentMutations();
  
  return {
    // Query operations
    fetchDocuments,
    fetchDocumentById,
    
    // Mutation operations
    createDocument,
    updateDocument,
    deleteDocument,
    
    // Loading state
    isLoading
  };
}
