
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToMarketingExample } from './transformUtils';
import { MarketingExampleUpdateInput } from './types';

/**
 * Hook for updating a marketing example
 */
export const useUpdateMarketingExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('MarketingExamplesApi');

  const updateMarketingExampleMutation = createMutation<Document, { id: string, updates: MarketingExampleUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Create request data with appropriate field names
      const requestData: Record<string, any> = {};
      if (updates.title !== undefined) requestData.title = updates.title;
      if (updates.content !== undefined) requestData.content = updates.content;
      
      const { data, error } = await supabase
        .from("documents")
        .update(requestData)
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("content_type", "marketing")
        .eq("purpose", "writing_sample")
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToMarketingExample(data);
    },
    'updating marketing example',
    {
      successMessage: 'Marketing example updated successfully',
      errorMessage: 'Failed to update marketing example',
      onSuccess: (_, variables) => {
        invalidateQueries(['marketing-examples', user?.id]);
        invalidateQueries(['marketing-example', variables.id, user?.id]);
      }
    }
  );
  
  const updateMarketingExample = async (id: string, updates: MarketingExampleUpdateInput): Promise<Document> => {
    return updateMarketingExampleMutation.mutateAsync({ id, updates });
  };

  return {
    updateMarketingExample,
    updateMarketingExampleMutation
  };
};
