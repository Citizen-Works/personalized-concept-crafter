import { 
  Document, 
  DocumentType, 
  DocumentPurpose,
  IdeaResponse,
  ContentIdea 
} from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processDocumentForIdeas } from '@/services/documents/processDocument';

interface DocumentCreateInput {
  title: string;
  content: string;
  purpose?: DocumentPurpose;
  isEncrypted?: boolean;
  type?: DocumentType;
}

interface DocumentUpdateInput {
  title?: string;
  content?: string;
  purpose?: DocumentPurpose;
  isEncrypted?: boolean;
  type?: DocumentType;
}

/**
 * Transform database record to Document type
 */
const transformToDocument = (doc: any): Document => {
  return {
    id: doc.id,
    userId: doc.user_id,
    title: doc.title,
    content: doc.content || '',
    type: doc.type as DocumentType,
    purpose: doc.purpose as DocumentPurpose,
    status: doc.status || 'active',
    content_type: doc.content_type,
    createdAt: new Date(doc.created_at),
    isEncrypted: doc.is_encrypted || false,
    processing_status: doc.processing_status || 'idle',
    has_ideas: doc.has_ideas || false,
    ideas_count: doc.ideas_count || 0
  };
};

/**
 * Invalidate all relevant queries after a mutation
 */
const invalidateAllQueries = (invalidateQueries: (queryKey: string[]) => void, userId?: string) => {
  console.log('Invalidating all relevant queries');
  // Invalidate both with and without user ID to catch all cases
  invalidateQueries(['documents']);
  if (userId) invalidateQueries(['documents', userId]);
  // Also invalidate the general documents query used by source materials
  invalidateQueries(['all-documents']);
  if (userId) invalidateQueries(['all-documents', userId]);
  console.log('Queries invalidated');
};

/**
 * Hook for document mutation operations
 */
export const useDocumentMutations = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('DocumentsAPI');

  /**
   * Create a new document
   */
  const createDocumentMutation = createMutation<Document, DocumentCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      console.log('Creating document with data:', input);
      
      const docData = {
        user_id: user.id,
        title: input.title,
        content: input.content,
        type: input.type || 'document' as DocumentType,
        purpose: input.purpose || 'business_context',
        is_encrypted: input.isEncrypted || false,
        processing_status: 'idle',
        status: 'active',
        content_type: 'text'
      };
      
      console.log('Sending to Supabase:', docData);
      
      const { data, error } = await supabase
        .from('documents')
        .insert([docData])
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Received from Supabase:', data);
      const transformed = transformToDocument(data);
      console.log('Transformed document:', transformed);
      
      return transformed;
    },
    'creating document',
    {
      successMessage: 'Document created successfully',
      errorMessage: 'Failed to create document',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Update an existing document
   */
  const updateDocumentMutation = createMutation<Document, { id: string; data: DocumentUpdateInput }>(
    async ({ id, data }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data: updatedData, error } = await supabase
        .from('documents')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .select('*')
        .single();
      
      if (error) throw error;
      
      return transformToDocument(updatedData);
    },
    'updating document',
    {
      successMessage: 'Document updated successfully',
      errorMessage: 'Failed to update document',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Delete a document
   */
  const deleteDocumentMutation = createMutation<boolean, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Security check
      
      if (error) throw error;
      
      return true;
    },
    'deleting document',
    {
      successMessage: 'Document deleted successfully',
      errorMessage: 'Failed to delete document',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Process a document to extract ideas
   */
  const processDocumentMutation = createMutation<IdeaResponse, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      try {
        const result = await processDocumentForIdeas(user.id, id);
        return result;
      } catch (error) {
        console.error('Error in processDocumentMutation:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to process document');
      }
    },
    'processing document',
    {
      successMessage: 'Document processed successfully',
      errorMessage: 'Failed to process document',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
        invalidateQueries(['ideas', user?.id]);
      }
    }
  );

  const createDocument = async (input: DocumentCreateInput): Promise<Document> => {
    return createDocumentMutation.mutateAsync(input);
  };

  const updateDocument = async (id: string, data: DocumentUpdateInput): Promise<Document> => {
    return updateDocumentMutation.mutateAsync({ id, data });
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    return deleteDocumentMutation.mutateAsync(id);
  };

  const processDocument = async (id: string): Promise<IdeaResponse> => {
    return processDocumentMutation.mutateAsync(id);
  };

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    processDocument,
    isLoading: 
      createDocumentMutation.isPending || 
      updateDocumentMutation.isPending || 
      deleteDocumentMutation.isPending ||
      processDocumentMutation.isPending
  };
}; 