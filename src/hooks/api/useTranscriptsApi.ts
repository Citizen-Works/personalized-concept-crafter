
import { Document } from '@/types';
import { useFetchTranscripts } from './transcripts/fetchOperations';
import { useTranscriptMutations } from './transcripts/mutationOperations';
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
    createTranscript, 
    updateTranscript, 
    deleteTranscript,
    processTranscript,
    isLoading: isMutationLoading 
  } = useTranscriptMutations();
  
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
