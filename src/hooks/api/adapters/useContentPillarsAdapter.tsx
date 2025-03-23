
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContentPillarsApi } from '../useContentPillarsApi';
import { ContentPillar } from '@/types';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from '../content-pillars/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useContentPillars hook
 * but uses the new standardized API pattern under the hood
 */
export const useContentPillarsAdapter = () => {
  const pillarsApi = useContentPillarsApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get all pillars query
  const pillarsQuery = useQuery({
    queryKey: ['contentPillars', userId],
    queryFn: () => pillarsApi.fetchContentPillars(),
    enabled: !!userId
  });
  
  // Create pillar mutation
  const createPillarMutation = useMutation({
    mutationFn: (pillar: ContentPillarCreateInput) => {
      return pillarsApi.createContentPillar(pillar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars', userId] });
    },
    onError: (error) => {
      console.error('Error creating content pillar:', error);
    }
  });
  
  // Update pillar mutation
  const updatePillarMutation = useMutation({
    mutationFn: (params: { id: string, updates: ContentPillarUpdateInput }) => {
      return pillarsApi.updateContentPillar(params.id, params.updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars', userId] });
      queryClient.invalidateQueries({ queryKey: ['contentPillar', variables.id] });
    }
  });
  
  // Archive pillar mutation
  const archivePillarMutation = useMutation({
    mutationFn: (id: string) => {
      return pillarsApi.archiveContentPillar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars', userId] });
    }
  });
  
  // Update pillar order mutation
  const updatePillarOrderMutation = useMutation({
    mutationFn: (pillarOrders: { id: string; displayOrder: number }[]) => {
      return Promise.all(
        pillarOrders.map(({ id, displayOrder }) => 
          pillarsApi.updateContentPillar(id, { displayOrder })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars', userId] });
    }
  });
  
  // Custom hook for getting a single pillar
  const getPillar = (id: string) => {
    return useQuery({
      queryKey: ['contentPillar', id, userId],
      queryFn: () => pillarsApi.fetchContentPillarById(id),
      enabled: !!id && !!userId
    });
  };
  
  return {
    contentPillars: pillarsQuery.data || [],
    isLoading: pillarsQuery.isLoading,
    isError: pillarsQuery.isError,
    error: pillarsQuery.error,
    refetch: pillarsQuery.refetch,
    getPillar,
    createContentPillar: createPillarMutation.mutate,
    createContentPillarAsync: createPillarMutation.mutateAsync,
    updateContentPillar: updatePillarMutation.mutate,
    updateContentPillarAsync: updatePillarMutation.mutateAsync,
    updatePillarOrder: updatePillarOrderMutation.mutate,
    deleteContentPillar: archivePillarMutation.mutate
  };
};
