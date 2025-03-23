
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallToActionsApi } from '../useCallToActionsApi';
import { CallToAction } from '@/types';
import { CallToActionCreateInput, CallToActionUpdateInput } from '../call-to-actions/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original useCallToActions hook
 * but uses the new standardized API pattern under the hood
 */
export const useCallToActionsAdapter = () => {
  const ctaApi = useCallToActionsApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get all call to actions query
  const ctasQuery = useQuery({
    queryKey: ['callToActions', userId],
    queryFn: () => ctaApi.fetchCallToActions(),
    enabled: !!userId
  });
  
  // Create call to action mutation
  const createCtaMutation = useMutation({
    mutationFn: (cta: CallToActionCreateInput) => {
      return ctaApi.createCallToAction(cta);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callToActions', userId] });
    },
    onError: (error) => {
      console.error('Error creating call to action:', error);
    }
  });
  
  // Update call to action mutation
  const updateCtaMutation = useMutation({
    mutationFn: (params: { id: string, updates: CallToActionUpdateInput }) => {
      return ctaApi.updateCallToAction(params.id, params.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callToActions', userId] });
    }
  });
  
  // Archive call to action mutation
  const archiveCtaMutation = useMutation({
    mutationFn: (id: string) => {
      return ctaApi.archiveCallToAction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callToActions', userId] });
    }
  });
  
  // Increment usage count mutation
  const incrementUsageCountMutation = useMutation({
    mutationFn: (id: string) => {
      return ctaApi.incrementUsageCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callToActions', userId] });
    }
  });
  
  // Custom hook for getting a single call to action
  const getCallToAction = (id: string) => {
    return useQuery({
      queryKey: ['callToAction', id, userId],
      queryFn: () => ctaApi.fetchCallToActionById(id),
      enabled: !!id && !!userId
    });
  };
  
  return {
    callToActions: ctasQuery.data || [],
    isLoading: ctasQuery.isLoading,
    isError: ctasQuery.isError,
    getCallToAction,
    createCallToAction: createCtaMutation.mutate,
    createCallToActionAsync: createCtaMutation.mutateAsync,
    updateCallToAction: updateCtaMutation.mutate,
    updateCallToActionAsync: updateCtaMutation.mutateAsync,
    archiveCallToAction: archiveCtaMutation.mutate,
    incrementUsageCount: incrementUsageCountMutation.mutate
  };
};
