
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting a marketing example
 */
export const useDeleteMarketingExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('MarketingExamplesApi');

  const deleteMarketingExampleMutation = createMutation<void, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("content_type", "marketing")
        .eq("purpose", "writing_sample");
        
      if (error) throw error;
    },
    'deleting marketing example',
    {
      successMessage: 'Marketing example deleted successfully',
      errorMessage: 'Failed to delete marketing example',
      onSuccess: () => {
        invalidateQueries(['marketing-examples', user?.id]);
      }
    }
  );
  
  const deleteMarketingExample = async (id: string): Promise<void> => {
    return deleteMarketingExampleMutation.mutateAsync(id);
  };

  return {
    deleteMarketingExample,
    deleteMarketingExampleMutation
  };
};
