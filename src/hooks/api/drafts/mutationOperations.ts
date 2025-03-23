
import { DraftCreateInput, DraftUpdateInput } from './types';
import { useCreateDraft } from './createOperation';
import { useUpdateDraft } from './updateOperation';
import { useDeleteDraft } from './deleteOperation';

/**
 * Hook for draft mutation operations
 */
export const useDraftMutations = () => {
  const { createDraft, createDraftMutation } = useCreateDraft();
  const { updateDraft, updateDraftMutation } = useUpdateDraft();
  const { deleteDraft, deleteDraftMutation } = useDeleteDraft();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createDraftMutation.isPending || 
    updateDraftMutation.isPending || 
    deleteDraftMutation.isPending;

  return {
    createDraft,
    updateDraft,
    deleteDraft,
    isLoading
  };
};
