
import { Document } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsletterExample } from './transformUtils';
import { NewsletterExampleUpdateInput } from './types';

/**
 * Hook for updating an existing newsletter example
 */
export const useUpdateNewsletterExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('NewsletterExamplesApi');

  const updateNewsletterExampleMutation = createMutation<Document, { id: string, updates: NewsletterExampleUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare update object with only the fields that need to be updated
      const updateData: Record<string, any> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      
      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .eq("content_type", "newsletter")
        .eq("purpose", "writing_sample")
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToNewsletterExample(data);
    },
    'updating newsletter example',
    {
      successMessage: 'Newsletter example updated successfully',
      errorMessage: 'Failed to update newsletter example',
      onSuccess: (data) => {
        invalidateQueries(['newsletter-examples', user?.id]);
        invalidateQueries(['newsletter-example', data.id, user?.id]);
      }
    }
  );
  
  const updateNewsletterExample = async (id: string, updates: NewsletterExampleUpdateInput): Promise<Document> => {
    return updateNewsletterExampleMutation.mutateAsync({ id, updates });
  };

  return {
    updateNewsletterExample,
    updateNewsletterExampleMutation
  };
};
