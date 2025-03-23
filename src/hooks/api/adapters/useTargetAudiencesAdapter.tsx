
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTargetAudienceApi } from '../useTargetAudienceApi';
import { TargetAudience } from '@/types';
import { TargetAudienceCreateInput, TargetAudienceUpdateInput } from '../target-audience/types';

/**
 * Adapter hook that provides the same interface as the original useTargetAudiences hook
 * but uses the new standardized API pattern under the hood
 */
export const useTargetAudiencesAdapter = () => {
  const audienceApi = useTargetAudienceApi();
  
  // Get all target audiences query
  const audiencesQuery = audienceApi.fetchTargetAudiences();
  
  // Create target audience mutation
  const createTargetAudienceMutation = useMutation({
    mutationFn: (audience: TargetAudienceCreateInput) => {
      return audienceApi.createTargetAudience(audience);
    }
  });
  
  // Update target audience mutation
  const updateTargetAudienceMutation = useMutation({
    mutationFn: (params: { id: string, updates: TargetAudienceUpdateInput }) => {
      return audienceApi.updateTargetAudience(params.id, params.updates);
    }
  });
  
  // Archive target audience mutation
  const archiveTargetAudienceMutation = useMutation({
    mutationFn: (id: string) => {
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
      queryFn: () => audienceApi.fetchTargetAudienceById(id).refetch().then(result => result.data)
    });
  };
  
  return {
    targetAudiences: audiencesQuery.data || [],
    isLoading: audiencesQuery.isLoading,
    isError: audiencesQuery.isError,
    getTargetAudience,
    createTargetAudience: createTargetAudienceMutation.mutate,
    updateTargetAudience: updateTargetAudienceMutation.mutate,
    archiveTargetAudience: archiveTargetAudienceMutation.mutate,
    incrementUsageCount: incrementUsageCountMutation.mutate,
    // For compatibility with the original hook
    deleteTargetAudience: archiveTargetAudienceMutation.mutate,
    updateTargetAudienceAsync: updateTargetAudienceMutation.mutateAsync
  };
};
