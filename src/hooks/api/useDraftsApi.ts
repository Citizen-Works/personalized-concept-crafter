import { ContentDraft } from '@/types';
import { useFetchDrafts } from './drafts/fetchOperations';
import { useDraftMutations } from './drafts/mutationOperations';
import { DraftCreateInput, DraftUpdateInput, DraftWithIdea } from './drafts/types';

/**
 * Hook for standardized Draft API operations
 */
export function useDraftsApi() {
  const { 
    draftsQuery,
    draftByIdQuery,
    draftsByIdeaIdQuery,
    isLoading: isFetchLoading 
  } = useFetchDrafts();
  
  const { 
    createDraft, 
    updateDraft, 
    deleteDraft, 
    isLoading: isMutationLoading 
  } = useDraftMutations();
  
  return {
    // Query operations
    draftsQuery,
    draftByIdQuery,
    draftsByIdeaIdQuery,
    
    // Mutation operations
    createDraft,
    updateDraft,
    deleteDraft,
    
    // Loading state
    isLoading: isFetchLoading || isMutationLoading
  };
}

// Re-export types for convenience
export type { DraftCreateInput, DraftUpdateInput, DraftWithIdea };
