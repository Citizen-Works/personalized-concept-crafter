
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTargetAudienceApi } from '../useTargetAudienceApi';
import { TargetAudience } from '@/types';
import { TargetAudienceCreateInput, TargetAudienceUpdateInput } from '../target-audience/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useTargetAudiences hook
 * but uses the new standardized API pattern under the hood
 */
export const useTargetAudiencesAdapter = () => {
  const audienceApi = useTargetAudienceApi();
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get all target audiences query
  const audiencesQuery = useQuery({
    queryKey: ['targetAudiences', userId],
    queryFn: async () => {
      return await audienceApi.fetchTargetAudiences.refetch().then(result => result.data || []);
    },
    enabled: !!userId,
    initialData: []
  });
  
  // Create target audience mutation
  const createAudienceMutation = useMutation({
    mutationFn: (audience: TargetAudienceCreateInput) => {
      return audienceApi.createTargetAudience(audience);
    }
  });
  
  // Update target audience mutation
  const updateAudienceMutation = useMutation({
    mutationFn: (params: { id: string, updates: TargetAudienceUpdateInput }) => {
      return audienceApi.updateTargetAudience(params.id, params.updates);
    }
  });
  
  // Archive target audience mutation
  const archiveAudienceMutation = useMutation({
    mutationFn: (id: string) => {
      return audienceApi.archiveTargetAudience(id);
    }
  });
  
  // Delete target audience (for backward compatibility)
  const deleteAudienceMutation = useMutation({
    mutationFn: (id: string) => {
      // In our new pattern, we don't actually delete but archive
      return audienceApi.archiveTargetAudience(id);
    }
  });
  
  // Increment usage count mutation
  const incrementUsageCountMutation = useMutation({
    mutationFn: (id: string) => {
      return audienceApi.incrementUsageCount(id);
    }
  });
  
  // Custom hook for getting a single target audience
  const getTargetAudience = (id: string) => {
    return useQuery({
      queryKey: ['targetAudience', id],
      queryFn: async () => {
        return await audienceApi.fetchTargetAudienceById(id);
      },
      enabled: !!id && !!userId
    });
  };
  
  return {
    targetAudiences: audiencesQuery.data || [],
    isLoading: audiencesQuery.isLoading,
    isError: audiencesQuery.isError,
    error: audiencesQuery.error,
    refetch: audiencesQuery.refetch,
    getTargetAudience,
    deleteTargetAudience: deleteAudienceMutation.mutate,
    updateTargetAudience: updateAudienceMutation.mutate,
    incrementUsageCount: incrementUsageCountMutation.mutate,
    createTargetAudience: createAudienceMutation.mutate,
    createTargetAudienceAsync: createAudienceMutation.mutateAsync,
    updateTargetAudienceAsync: updateAudienceMutation.mutateAsync
  };
};
