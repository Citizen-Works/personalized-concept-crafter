import { Document } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsletterExample } from './transformUtils';
import { NewsletterExampleCreateInput } from './types';

/**
 * Hook for creating a new newsletter example
 */
export const useCreateNewsletterExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('NewsletterExamplesApi');

  const createNewsletterExampleMutation = createMutation<Document, NewsletterExampleCreateInput>(
    async (example) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: example.title,
          content: example.content,
          content_type: null,
          purpose: "writing_sample",
          type: "newsletter", // Add the missing 'type' field
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToNewsletterExample(data);
    },
    'creating newsletter example',
    {
      successMessage: 'Newsletter example created successfully',
      errorMessage: 'Failed to create newsletter example',
      onSuccess: () => {
        invalidateQueries(['newsletter-examples', user?.id]);
        invalidateQueries(['documents', user?.id]);
        invalidateQueries(['all-documents', user?.id]);
      }
    }
  );
  
  const createNewsletterExample = async (example: NewsletterExampleCreateInput): Promise<Document> => {
    return createNewsletterExampleMutation.mutateAsync(example);
  };

  return {
    createNewsletterExample,
    createNewsletterExampleMutation
  };
};
