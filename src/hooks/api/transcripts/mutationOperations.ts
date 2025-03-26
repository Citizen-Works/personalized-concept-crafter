import { Document, DocumentType, DocumentPurpose } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processTranscriptForIdeas } from '@/services/documents/transcript/processTranscript';
import { TranscriptCreateInput, TranscriptUpdateInput, TranscriptProcessingResult } from './types';

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
  invalidateQueries(['transcripts']);
  if (userId) invalidateQueries(['transcripts', userId]);
  invalidateQueries(['documents']);
  if (userId) invalidateQueries(['documents', userId]);
  // Also invalidate the general documents query used by source materials
  invalidateQueries(['all-documents']);
  if (userId) invalidateQueries(['all-documents', userId]);
  console.log('Queries invalidated');
};

/**
 * Hook for transcript mutation operations
 */
export const useTranscriptMutations = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TranscriptsAPI');

  /**
   * Create a new transcript
   */
  const createTranscriptMutation = createMutation<Document, TranscriptCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      console.log('Creating transcript with data:', input);
      
      const docData = {
        user_id: user.id,
        title: input.title,
        content: input.content,
        type: 'transcript' as DocumentType,
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
    'creating transcript',
    {
      successMessage: 'Transcript created successfully',
      errorMessage: 'Failed to create transcript',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Update an existing transcript
   */
  const updateTranscriptMutation = createMutation<Document, { id: string; data: TranscriptUpdateInput }>(
    async ({ id, data }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data: updatedData, error } = await supabase
        .from('documents')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .eq('type', 'transcript')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return transformToDocument(updatedData);
    },
    'updating transcript',
    {
      successMessage: 'Transcript updated successfully',
      errorMessage: 'Failed to update transcript',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Delete a transcript
   */
  const deleteTranscriptMutation = createMutation<boolean, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .eq('type', 'transcript');
      
      if (error) throw error;
      
      return true;
    },
    'deleting transcript',
    {
      successMessage: 'Transcript deleted successfully',
      errorMessage: 'Failed to delete transcript',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
      }
    }
  );

  /**
   * Process a transcript to extract ideas
   */
  const processTranscriptMutation = createMutation<TranscriptProcessingResult, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // This uses the existing transcript processing service
      return await processTranscriptForIdeas(user.id, id);
    },
    'processing transcript',
    {
      successMessage: 'Transcript processed successfully',
      errorMessage: 'Failed to process transcript',
      onSuccess: () => {
        invalidateAllQueries(invalidateQueries, user?.id);
        invalidateQueries(['ideas', user?.id]);
      }
    }
  );

  const createTranscript = async (input: TranscriptCreateInput): Promise<Document> => {
    return createTranscriptMutation.mutateAsync(input);
  };

  const updateTranscript = async (id: string, data: TranscriptUpdateInput): Promise<Document> => {
    return updateTranscriptMutation.mutateAsync({ id, data });
  };

  const deleteTranscript = async (id: string): Promise<boolean> => {
    return deleteTranscriptMutation.mutateAsync(id);
  };

  const processTranscript = async (id: string): Promise<TranscriptProcessingResult> => {
    return processTranscriptMutation.mutateAsync(id);
  };

  return {
    createTranscript,
    updateTranscript,
    deleteTranscript,
    processTranscript,
    isLoading: 
      createTranscriptMutation.isPending || 
      updateTranscriptMutation.isPending || 
      deleteTranscriptMutation.isPending ||
      processTranscriptMutation.isPending
  };
};
