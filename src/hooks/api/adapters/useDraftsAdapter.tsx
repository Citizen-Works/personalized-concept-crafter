
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDraftsApi, DraftCreateInput, DraftUpdateInput } from '../useDraftsApi';
import { DraftWithIdea } from '../drafts/types';

/**
 * Adapter hook that provides the same interface as the original useDrafts hook
 * but uses the new standardized API pattern under the hood
 */
export const useDraftsAdapter = () => {
  const draftsApi = useDraftsApi();
  const queryClient = useQueryClient();
  
  // Get all drafts query
  const draftsQuery = useQuery({
    queryKey: ['drafts'],
    queryFn: () => draftsApi.fetchDrafts()
  });
  
  // Create draft mutation
  const createDraftMutation = useMutation({
    mutationFn: (draft: DraftCreateInput) => {
      return draftsApi.createDraft(draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    }
  });
  
  // Update draft mutation
  const updateDraftMutation = useMutation({
    mutationFn: (params: { id: string } & DraftUpdateInput) => {
      const { id, ...updateData } = params;
      return draftsApi.updateDraft(id, updateData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['draft', variables.id] });
    }
  });
  
  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: (id: string) => {
      return draftsApi.deleteDraft(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    }
  });
  
  // Custom hook for getting drafts by idea ID
  const getDraftsByIdeaId = (ideaId: string) => {
    return useQuery({
      queryKey: ['drafts', 'byIdeaId', ideaId],
      queryFn: () => draftsApi.fetchDraftsByIdeaId(ideaId)
    });
  };
  
  // Custom hook for getting a single draft
  const getDraft = (id: string) => {
    return useQuery({
      queryKey: ['draft', id],
      queryFn: () => draftsApi.fetchDraftById(id),
      enabled: !!id
    });
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
    deleteDraft: (id: string) => deleteDraftMutation.mutate(id)
  };
};
