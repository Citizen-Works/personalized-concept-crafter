
import { ContentDraft } from '@/types';
import { useFetchDrafts } from './drafts/fetchOperations';
import { useDraftMutations } from './drafts/mutationOperations';
import { DraftCreateInput, DraftUpdateInput } from './drafts/types';

/**
 * Hook for standardized Draft API operations
 */
export function useDraftsApi() {
  const { fetchDrafts, fetchDraftById, fetchDraftsByIdeaId } = useFetchDrafts();
  const { 
    createDraft, 
    updateDraft, 
    deleteDraft, 
    isLoading 
  } = useDraftMutations();
  
  return {
    // Query operations
    fetchDrafts,
    fetchDraftById,
    fetchDraftsByIdeaId,
    
    // Mutation operations
    createDraft,
    updateDraft,
    deleteDraft,
    
    // Loading state
    isLoading
  };
}

// Re-export types for convenience
export type { DraftCreateInput, DraftUpdateInput };
