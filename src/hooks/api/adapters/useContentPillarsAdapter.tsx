
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContentPillarsApi } from '../useContentPillarsApi';
import { ContentPillar } from '@/types';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from '../content-pillars/types';

/**
 * Adapter hook that provides the same interface as the original useContentPillars hook
 * but uses the new standardized API pattern under the hood
 */
export const useContentPillarsAdapter = () => {
  const pillarsApi = useContentPillarsApi();
  const queryClient = useQueryClient();
  
  // Get all pillars query
  const pillarsQuery = useQuery({
    queryKey: ['contentPillars'],
    queryFn: () => pillarsApi.fetchContentPillars()
  });
  
  // Create pillar mutation
  const createPillarMutation = useMutation({
    mutationFn: (pillar: ContentPillarCreateInput) => {
      return pillarsApi.createContentPillar(pillar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
    }
  });
  
  // Update pillar mutation
  const updatePillarMutation = useMutation({
    mutationFn: (params: { id: string, updates: ContentPillarUpdateInput }) => {
      return pillarsApi.updateContentPillar(params.id, params.updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
      queryClient.invalidateQueries({ queryKey: ['contentPillar', variables.id] });
    }
  });
  
  // Archive pillar mutation
  const archivePillarMutation = useMutation({
    mutationFn: (id: string) => {
      return pillarsApi.archiveContentPillar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
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
      queryClient.invalidateQueries({ queryKey: ['contentPillars'] });
    }
  });
  
  // Custom hook for getting a single pillar
  const getPillar = (id: string) => {
    return useQuery({
      queryKey: ['contentPillar', id],
      queryFn: () => pillarsApi.fetchContentPillarById(id),
      enabled: !!id
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
    updateContentPillar: updatePillarMutation.mutate,
    updatePillarOrder: updatePillarOrderMutation.mutate,
    deleteContentPillar: archivePillarMutation.mutate
  };
};
