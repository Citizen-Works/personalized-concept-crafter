import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDraftsApi, DraftCreateInput, DraftUpdateInput } from '../useDraftsApi';
import { DraftWithIdea } from '../drafts/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useDrafts hook
 * but uses the new standardized API pattern under the hood
 */
export const useDraftsAdapter = () => {
  const draftsApi = useDraftsApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Create draft mutation
  const createDraftMutation = useMutation({
    mutationFn: (draft: DraftCreateInput) => {
      return draftsApi.createDraft(draft);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['drafts-by-idea', variables.contentIdeaId] });
      // Also invalidate ideas query since hasBeenUsed might have changed
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });
  
  // Update draft mutation
  const updateDraftMutation = useMutation({
    mutationFn: (params: { id: string } & DraftUpdateInput) => {
      return draftsApi.updateDraft(params);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['draft', variables.id] });
      if (variables.contentIdeaId) {
        queryClient.invalidateQueries({ queryKey: ['drafts-by-idea', variables.contentIdeaId] });
      }
    }
  });
  
  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: (id: string) => {
      return draftsApi.deleteDraft(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['drafts-by-idea'] });
    }
  });
  
  // Get the query results from the API
  const { draftsQuery, draftByIdQuery, draftsByIdeaIdQuery } = draftsApi;
  
  return {
    drafts: draftsQuery.data || [],
    isLoading: draftsQuery.isLoading,
    isError: draftsQuery.isError,
    getDraftsByIdeaId: (ideaId: string) => {
      const query = draftsByIdeaIdQuery(ideaId);
      return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError
      };
    },
    getDraft: (id: string) => {
      const query = draftByIdQuery(id);
      return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError
      };
    },
    createDraft: (draft: DraftCreateInput) => createDraftMutation.mutateAsync(draft),
    updateDraft: (params: { id: string } & DraftUpdateInput) => updateDraftMutation.mutateAsync(params),
    deleteDraft: (id: string) => deleteDraftMutation.mutateAsync(id),
    refetch: draftsQuery.refetch
  };
};
