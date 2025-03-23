
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDocument } from './transformUtils';

/**
 * Hook for deleting a document (hard delete)
 */
export const useDeleteDocument = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DocumentsApi');

  const deleteDocumentMutation = createMutation<void, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Store document data before deletion for returning
      const { data: documentToDelete, error: fetchError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      if (!documentToDelete) throw new Error("Document not found");
      
      // Delete the document
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Security check
        
      if (error) throw error;
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
  
  const deleteDocument = async (id: string): Promise<void> => {
    return deleteDocumentMutation.mutateAsync(id);
  };

  return {
    deleteDocument,
    deleteDocumentMutation
  };
};
