
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  
  // Get all target audiences query
  const audiencesQuery = useQuery({
    queryKey: ['targetAudiences', userId],
    queryFn: () => audienceApi.fetchTargetAudiences(),
    enabled: !!userId
  });
  
  // Create target audience mutation
  const createAudienceMutation = useMutation({
    mutationFn: (audience: TargetAudienceCreateInput) => {
      return audienceApi.createTargetAudience(audience);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetAudiences', userId] });
    },
    onError: (error) => {
      console.error('Error creating target audience:', error);
    }
  });
  
  // Update target audience mutation
  const updateAudienceMutation = useMutation({
    mutationFn: (params: { id: string, updates: TargetAudienceUpdateInput }) => {
      return audienceApi.updateTargetAudience(params.id, params.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetAudiences', userId] });
    }
  });
  
  // Archive target audience mutation
  const archiveAudienceMutation = useMutation({
    mutationFn: (id: string) => {
      return audienceApi.archiveTargetAudience(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetAudiences', userId] });
    }
  });
  
  // Delete target audience (for backward compatibility)
  const deleteAudienceMutation = useMutation({
    mutationFn: (id: string) => {
      // In our new pattern, we don't actually delete but archive
      return audienceApi.archiveTargetAudience(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetAudiences', userId] });
    }
  });
  
  // Increment usage count mutation
  const incrementUsageCountMutation = useMutation({
    mutationFn: (id: string) => {
      return audienceApi.incrementUsageCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetAudiences', userId] });
    }
  });
  
  /**
   * Function that returns a query hook for a single target audience
   * This returns the useQuery hook directly instead of calling it
   */
  const getTargetAudience = (id: string) => {
    return useQuery({
      queryKey: ['targetAudience', id, userId],
      queryFn: () => audienceApi.fetchTargetAudienceById(id),
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
