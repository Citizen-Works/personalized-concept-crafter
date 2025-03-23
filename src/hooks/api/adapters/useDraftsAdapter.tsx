
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDraftsApi, DraftCreateInput, DraftUpdateInput } from '../useDraftsApi';
import { ContentDraft } from '@/types';

/**
 * Adapter hook that provides the same interface as the original useDrafts hook
 * but uses the new standardized API pattern under the hood
 */
export const useDraftsAdapter = () => {
  const draftsApi = useDraftsApi();
  
  // Get all drafts query
  const draftsQuery = draftsApi.fetchDrafts();
  
  // Create draft mutation
  const createDraftMutation = useMutation({
    mutationFn: (draft: DraftCreateInput) => {
      return draftsApi.createDraft(draft);
    }
  });
  
  // Update draft mutation
  const updateDraftMutation = useMutation({
    mutationFn: (params: { id: string } & DraftUpdateInput) => {
      return draftsApi.updateDraft(params);
    }
  });
  
  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: (params: { id: string, contentIdeaId: string }) => {
      return draftsApi.deleteDraft(params.id, params.contentIdeaId);
    }
  });
  
  // Custom hook for getting drafts by idea ID
  const getDraftsByIdeaId = (ideaId: string) => {
    return draftsApi.fetchDraftsByIdeaId(ideaId);
  };
  
  // Custom hook for getting a single draft
  const getDraft = (id: string) => {
    return draftsApi.fetchDraftById(id);
  };
  
  return {
    drafts: draftsQuery.data || [],
    isLoading: draftsQuery.isLoading,
    isError: draftsQuery.isError,
    getDraftsByIdeaId,
    getDraft,
    createDraft: (draft: DraftCreateInput) => createDraftMutation.mutate(draft),
    createDraftAsync: (draft: DraftCreateInput) => createDraftMutation.mutateAsync(draft),
    updateDraft: (params: { id: string } & DraftUpdateInput) => updateDraftMutation.mutate(params),
    updateDraftAsync: (params: { id: string } & DraftUpdateInput) => updateDraftMutation.mutateAsync(params),
    deleteDraft: (id: string) => {
      // Since our new API requires contentIdeaId for optimal cache invalidation,
      // we first need to get the draft to obtain its contentIdeaId
      getDraft(id).refetch().then(result => {
        const draft = result.data as ContentDraft;
        if (draft) {
          deleteDraftMutation.mutate({ id, contentIdeaId: draft.contentIdeaId });
        }
      });
    }
  };
};
