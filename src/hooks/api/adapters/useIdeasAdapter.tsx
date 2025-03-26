import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIdeasApi } from '../useIdeasApi';
import { ContentIdea } from '@/types';
import { IdeaCreateInput, IdeaUpdateInput } from '../ideas/types';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentIdea } from '../ideas/transformUtils';

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
  
  return {
    ideas: ideasQuery.data || [],
    isLoading: ideasQuery.isLoading || ideasApi.isLoading,
    isError: ideasQuery.isError,
    createIdea: createIdeaMutation.mutate,
    createIdeaAsync: createIdeaMutation.mutateAsync,
    updateIdea: updateIdeaMutation.mutate,
    updateIdeaAsync: updateIdeaMutation.mutateAsync,
    deleteIdea: deleteIdeaMutation.mutate
  };
};

/**
 * Hook for fetching a single idea
 */
export const useIdea = (id: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['idea', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from("content_ideas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching idea with ID ${id}:`, error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Idea not found');
      }

      return transformToContentIdea(data);
    },
    enabled: !!id && id !== 'new' && !!user?.id,
    retry: 1,
    refetchOnWindowFocus: false
  });
};
