
import { Document } from '@/types';
import { MarketingExampleCreateInput, MarketingExampleUpdateInput } from './types';
import { useCreateMarketingExample } from './createOperation';
import { useUpdateMarketingExample } from './updateOperation';
import { useDeleteMarketingExample } from './deleteOperation';

/**
 * Hook for marketing example mutation operations
 */
export const useMarketingExampleMutations = () => {
  const { createMarketingExample, createMarketingExampleMutation } = useCreateMarketingExample();
  const { updateMarketingExample, updateMarketingExampleMutation } = useUpdateMarketingExample();
  const { deleteMarketingExample, deleteMarketingExampleMutation } = useDeleteMarketingExample();

  // Properly determine the loading state from all mutations
  const isLoading = 
    createMarketingExampleMutation.isPending || 
    updateMarketingExampleMutation.isPending || 
    deleteMarketingExampleMutation.isPending;

  return {
    createMarketingExample,
    updateMarketingExample,
    deleteMarketingExample,
    isLoading
  };
};
