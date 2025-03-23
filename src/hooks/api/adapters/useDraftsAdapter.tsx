
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
      return draftsApi.createDraft().mutateAsync(draft);
    }
  });
  
  // Update draft mutation
  const updateDraftMutation = useMutation({
    mutationFn: (params: { id: string } & DraftUpdateInput) => {
      return draftsApi.updateDraft().mutateAsync(params);
    }
  });
  
  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: (params: { id: string, contentIdeaId: string }) => {
      return draftsApi.deleteDraft().mutateAsync(params);
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
    createDraft: createDraftMutation.mutate,
    createDraftAsync: createDraftMutation.mutateAsync,
    updateDraft: updateDraftMutation.mutate,
    updateDraftAsync: updateDraftMutation.mutateAsync,
    deleteDraft: deleteDraftMutation.mutate
  };
};
