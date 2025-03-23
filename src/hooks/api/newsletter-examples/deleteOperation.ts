
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting a newsletter example
 */
export const useDeleteNewsletterExample = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('NewsletterExamplesApi');

  const deleteNewsletterExampleMutation = createMutation<void, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .eq("content_type", "newsletter")
        .eq("purpose", "writing_sample");
        
      if (error) throw error;
    },
    'deleting newsletter example',
    {
      successMessage: 'Newsletter example deleted successfully',
      errorMessage: 'Failed to delete newsletter example',
      onSuccess: () => {
        invalidateQueries(['newsletter-examples', user?.id]);
      }
    }
  );
  
  const deleteNewsletterExample = async (id: string): Promise<void> => {
    return deleteNewsletterExampleMutation.mutateAsync(id);
  };

  return {
    deleteNewsletterExample,
    deleteNewsletterExampleMutation
  };
};
