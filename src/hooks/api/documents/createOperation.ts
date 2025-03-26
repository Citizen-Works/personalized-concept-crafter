import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDocument } from './transformUtils';
import { DocumentCreateInput } from './types';

/**
 * Hook for creating a new document
 */
export const useCreateDocument = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DocumentsApi');

  const createDocumentMutation = createMutation<Document, DocumentCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Create the request data with appropriate field names
      const requestData = {
        title: input.title,
        content: input.content,
        file_url: input.fileUrl,
        file_type: input.fileType,
        file_name: input.fileName,
        file_size: input.fileSize,
        type: input.type, // Required field
        purpose: input.purpose || 'business_context',
        content_type: input.contentType,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("documents")
        .insert(requestData)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToDocument(data);
    },
    'creating document',
    {
      successMessage: 'Document created successfully',
      errorMessage: 'Failed to create document',
      onSuccess: () => {
        invalidateQueries(['documents', user?.id]);
      }
    }
  );
  
  const createDocument = async (document: DocumentCreateInput): Promise<Document> => {
    return createDocumentMutation.mutateAsync(document);
  };

  return {
    createDocument,
    createDocumentMutation
  };
};
