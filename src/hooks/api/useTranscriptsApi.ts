import { Document } from '@/types';
import { useFetchTranscripts } from './transcripts/fetchOperations';
import { useDocumentMutations } from './documents/documentMutations';
import { 
  TranscriptCreateInput, 
  TranscriptUpdateInput, 
  TranscriptFilterOptions, 
  TranscriptProcessingResult 
} from './transcripts/types';

/**
 * Hook for standardized Transcripts API operations
 */
export function useTranscriptsApi() {
  const { 
    fetchTranscripts, 
    fetchTranscriptById,
    fetchFilteredTranscripts,
    isLoading: isFetchLoading 
  } = useFetchTranscripts();
  
  const { 
    createDocument, 
    updateDocument, 
    deleteDocument,
    processDocument,
    isLoading: isMutationLoading 
  } = useDocumentMutations();
  
  // Adapt document operations to transcript operations
  const createTranscript = async (input: TranscriptCreateInput) => {
    return createDocument({
      ...input,
      type: 'transcript'
    });
  };

  const updateTranscript = async (id: string, data: TranscriptUpdateInput) => {
    return updateDocument(id, data);
  };

  const deleteTranscript = async (id: string) => {
    return deleteDocument(id);
  };

  const processTranscript = async (id: string): Promise<TranscriptProcessingResult> => {
    return processDocument(id) as Promise<TranscriptProcessingResult>;
  };
  
  return {
    // Query operations
    fetchTranscripts,
    fetchTranscriptById,
    fetchFilteredTranscripts,
    
    // Mutation operations
    createTranscript,
    updateTranscript,
    deleteTranscript,
    processTranscript,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { 
  TranscriptCreateInput, 
  TranscriptUpdateInput, 
  TranscriptFilterOptions, 
  TranscriptProcessingResult 
};
