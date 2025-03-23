
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToMarketingExample } from './transformUtils';
import { MarketingExampleCreateInput } from './types';

/**
 * Hook for creating a new marketing example
 */
export const useCreateMarketingExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('MarketingExamplesApi');

  const createMarketingExampleMutation = createMutation<Document, MarketingExampleCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("documents")
        .insert([
          {
            title: input.title,
            content: input.content,
            type: 'other', // This matches the Document type constraints
            purpose: 'writing_sample',
            status: 'active',
            content_type: 'marketing',
            user_id: user.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToMarketingExample(data);
    },
    'creating marketing example',
    {
      successMessage: 'Marketing example created successfully',
      errorMessage: 'Failed to create marketing example',
      onSuccess: () => {
        invalidateQueries(['marketing-examples', user?.id]);
      }
    }
  );
  
  const createMarketingExample = async (example: MarketingExampleCreateInput): Promise<Document> => {
    return createMarketingExampleMutation.mutateAsync(example);
  };

  return {
    createMarketingExample,
    createMarketingExampleMutation
  };
};
