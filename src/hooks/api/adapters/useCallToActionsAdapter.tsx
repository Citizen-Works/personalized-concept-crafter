
import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallToActionsApi } from '../useCallToActionsApi';
import { CallToAction } from '@/types';
import { CallToActionCreateInput, CallToActionUpdateInput } from '../call-to-actions/types';

/**
 * Adapter hook that provides the same interface as the original useCallToActions hook
 * but uses the new standardized API pattern under the hood
 */
export const useCallToActionsAdapter = () => {
  const ctaApi = useCallToActionsApi();
  
  // Get all call to actions query
  const ctasQuery = useQuery({
    queryKey: ['callToActions'],
    queryFn: () => ctaApi.fetchCallToActions()
  });
  
  // Create call to action mutation
  const createCtaMutation = useMutation({
    mutationFn: (cta: CallToActionCreateInput) => {
      return ctaApi.createCallToAction(cta);
    }
  });
  
  // Update call to action mutation
  const updateCtaMutation = useMutation({
    mutationFn: (params: { id: string, updates: CallToActionUpdateInput }) => {
      return ctaApi.updateCallToAction(params.id, params.updates);
    }
  });
  
  // Archive call to action mutation
  const archiveCtaMutation = useMutation({
    mutationFn: (id: string) => {
      return ctaApi.archiveCallToAction(id);
    }
  });
  
  // Increment usage count mutation
  const incrementUsageCountMutation = useMutation({
    mutationFn: (id: string) => {
      return ctaApi.incrementUsageCount(id);
    }
  });
  
  // Custom hook for getting a single call to action
  const getCallToAction = (id: string) => {
    return useQuery({
      queryKey: ['callToAction', id],
      queryFn: () => ctaApi.fetchCallToActionById(id)
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
