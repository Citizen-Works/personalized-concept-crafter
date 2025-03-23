
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIdeasApi } from '../useIdeasApi';
import { ContentIdea } from '@/types';
import { IdeaCreateInput, IdeaUpdateInput } from '../ideas/types';

/**
 * Adapter hook that provides the same interface as the original useIdeas hook
 * but uses the new standardized API pattern under the hood
 */
export const useIdeasAdapter = () => {
  const ideasApi = useIdeasApi();
  const queryClient = useQueryClient();
  
  // Get all ideas query
  const ideasQuery = useQuery({
    queryKey: ['ideas-adapter'],
    queryFn: () => ideasApi.fetchIdeas(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Create idea mutation
  const createIdeaMutation = useMutation({
    mutationFn: (idea: IdeaCreateInput) => {
      return ideasApi.createIdea(idea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas-adapter'] });
    }
  });
  
  // Update idea mutation
  const updateIdeaMutation = useMutation({
    mutationFn: (params: { id: string } & IdeaUpdateInput) => {
      return ideasApi.updateIdea(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas-adapter'] });
    }
  });
  
  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: (id: string) => {
      return ideasApi.deleteIdea(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas-adapter'] });
    }
  });
  
  // Custom hook for getting a single idea
  const getIdea = (id: string) => {
    return useQuery({
      queryKey: ['idea-adapter', id],
      queryFn: () => ideasApi.fetchIdeaById(id),
      enabled: !!id && id !== 'new'
    });
  };
  
  return {
    ideas: ideasQuery.data || [],
    isLoading: ideasQuery.isLoading || ideasApi.isLoading,
    isError: ideasQuery.isError,
    getIdea,
    createIdea: createIdeaMutation.mutate,
    createIdeaAsync: createIdeaMutation.mutateAsync,
    updateIdea: updateIdeaMutation.mutate,
    updateIdeaAsync: updateIdeaMutation.mutateAsync,
    deleteIdea: deleteIdeaMutation.mutate
  };
};
