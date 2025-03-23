
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for deleting documents
 */
export const useDeleteDocument = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DocumentsApi');

  const deleteDocumentMutation = createMutation<boolean, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      return true;
    },
    'deleting document',
    {
      successMessage: 'Document deleted successfully',
      errorMessage: 'Failed to delete document',
      onSuccess: () => {
        invalidateQueries(['documents', user?.id]);
      }
    }
  );
  
  const deleteDocument = async (id: string): Promise<boolean> => {
    return deleteDocumentMutation.mutateAsync(id);
  };

  return {
    deleteDocument,
    deleteDocumentMutation
  };
};
