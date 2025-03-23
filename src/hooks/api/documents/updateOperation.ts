
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDocument } from './transformUtils';
import { DocumentUpdateInput } from './types';

/**
 * Hook for updating documents
 */
export const useUpdateDocument = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DocumentsApi');

  const updateDocumentMutation = createMutation<Document, { id: string, updates: DocumentUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Create request data with appropriate field names
      const requestData: Record<string, any> = {};
      if (updates.title !== undefined) requestData.title = updates.title;
      if (updates.content !== undefined) requestData.content = updates.content;
      if (updates.fileUrl !== undefined) requestData.file_url = updates.fileUrl;
      if (updates.fileType !== undefined) requestData.file_type = updates.fileType;
      if (updates.fileName !== undefined) requestData.file_name = updates.fileName;
      if (updates.fileSize !== undefined) requestData.file_size = updates.fileSize;
      if (updates.metadata !== undefined) requestData.metadata = updates.metadata;
      if (updates.isArchived !== undefined) requestData.is_archived = updates.isArchived;
      if (updates.type !== undefined) requestData.type = updates.type;
      if (updates.purpose !== undefined) requestData.purpose = updates.purpose;
      if (updates.contentType !== undefined) requestData.content_type = updates.contentType;
      if (updates.status !== undefined) requestData.status = updates.status;
      
      const { data, error } = await supabase
        .from("documents")
        .update(requestData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToDocument(data);
    },
    'updating document',
    {
      successMessage: 'Document updated successfully',
      errorMessage: 'Failed to update document',
      onSuccess: (_, variables) => {
        invalidateQueries(['documents', user?.id]);
        invalidateQueries(['document', variables.id, user?.id]);
      }
    }
  );
  
  const updateDocument = async (id: string, updates: DocumentUpdateInput): Promise<Document> => {
    return updateDocumentMutation.mutateAsync({ id, updates });
  };

  return {
    updateDocument,
    updateDocumentMutation
  };
};
