
import { useQuery, useMutation } from '@tanstack/react-query';
import { useContentPillarsApi } from '../useContentPillarsApi';
import { ContentPillar } from '@/types';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from '../content-pillars/types';

/**
 * Adapter hook that provides the same interface as the original useContentPillars hook
 * but uses the new standardized API pattern under the hood
 */
export const useContentPillarsAdapter = () => {
  const pillarsApi = useContentPillarsApi();
  
  // Get all pillars query
  const pillarsQuery = useQuery({
    queryKey: ['contentPillars'],
    queryFn: () => pillarsApi.fetchContentPillars()
  });
  
  // Create pillar mutation
  const createPillarMutation = useMutation({
    mutationFn: (pillar: ContentPillarCreateInput) => {
      return pillarsApi.createContentPillar(pillar);
    }
  });
  
  // Update pillar mutation
  const updatePillarMutation = useMutation({
    mutationFn: (params: { id: string, updates: ContentPillarUpdateInput }) => {
      return pillarsApi.updateContentPillar(params.id, params.updates);
    }
  });
  
  // Archive pillar mutation
  const archivePillarMutation = useMutation({
    mutationFn: (id: string) => {
      return pillarsApi.archiveContentPillar(id);
    }
  });
  
  // Custom hook for getting a single pillar
  const getPillar = (id: string) => {
    return useQuery({
      queryKey: ['contentPillar', id],
      queryFn: () => pillarsApi.fetchContentPillarById(id)
    });
  };
  
  return {
    pillars: pillarsQuery.data || [],
    isLoading: pillarsQuery.isLoading,
    isError: pillarsQuery.isError,
    getPillar,
    createPillar: createPillarMutation.mutate,
    createPillarAsync: createPillarMutation.mutateAsync,
    updatePillar: updatePillarMutation.mutate,
    updatePillarAsync: updatePillarMutation.mutateAsync,
    archivePillar: archivePillarMutation.mutate
  };
};
