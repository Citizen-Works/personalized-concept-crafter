
import { useQuery, useMutation } from '@tanstack/react-query';
import { useIdeasApi } from '../useIdeasApi';
import { ContentIdea } from '@/types';
import { IdeaCreateInput, IdeaUpdateInput } from '../../ideas/types';

/**
 * Adapter hook that provides the same interface as the original useIdeas hook
 * but uses the new standardized API pattern under the hood
 */
export const useIdeasAdapter = () => {
  const ideasApi = useIdeasApi();
  
  // Get all ideas query
  const ideasQuery = ideasApi.fetchIdeas();
  
  // Create idea mutation
  const createIdeaMutation = useMutation({
    mutationFn: (idea: IdeaCreateInput) => {
      return ideasApi.createIdea().mutateAsync(idea);
    }
  });
  
  // Update idea mutation
  const updateIdeaMutation = useMutation({
    mutationFn: (params: { id: string } & IdeaUpdateInput) => {
      return ideasApi.updateIdea().mutateAsync(params);
    }
  });
  
  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: (id: string) => {
      return ideasApi.deleteIdea().mutateAsync(id);
    }
  });
  
  // Custom hook for getting a single idea
  const getIdea = (id: string) => {
    return useQuery({
      queryKey: ['idea', id],
      queryFn: () => ideasApi.fetchIdeaById(id).refetch().then(result => result.data)
    });
  };
  
  return {
    ideas: ideasQuery.data || [],
    isLoading: ideasQuery.isLoading,
    isError: ideasQuery.isError,
    getIdea,
    createIdea: createIdeaMutation.mutate,
    createIdeaAsync: createIdeaMutation.mutateAsync,
    updateIdea: updateIdeaMutation.mutate,
    updateIdeaAsync: updateIdeaMutation.mutateAsync,
    deleteIdea: deleteIdeaMutation.mutate
  };
};
