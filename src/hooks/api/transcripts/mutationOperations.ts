
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processTranscriptForIdeas } from '@/services/documents/transcript/processTranscript';
import { TranscriptCreateInput, TranscriptUpdateInput, TranscriptProcessingResult } from './types';

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
      
      const docData = {
        user_id: user.id,
        title: input.title,
        content: input.content,
        type: 'transcript',
        purpose: input.purpose || 'business_context',
        is_encrypted: input.isEncrypted || false,
        processing_status: 'idle'
      };
      
      const { data, error } = await supabase
        .from('documents')
        .insert([docData])
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content || '',
        type: data.type,
        purpose: data.purpose,
        status: data.status,
        content_type: data.content_type,
        createdAt: new Date(data.created_at),
        isEncrypted: data.is_encrypted || false,
        processing_status: data.processing_status || 'idle',
        has_ideas: data.has_ideas || false,
        ideas_count: data.ideas_count || 0
      };
    },
    'creating transcript',
    {
      successMessage: 'Transcript created successfully',
      errorMessage: 'Failed to create transcript',
      onSuccess: () => {
        invalidateQueries(['transcripts', user?.id]);
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
      
      return {
        id: updatedData.id,
        userId: updatedData.user_id,
        title: updatedData.title,
        content: updatedData.content || '',
        type: updatedData.type,
        purpose: updatedData.purpose,
        status: updatedData.status,
        content_type: updatedData.content_type,
        createdAt: new Date(updatedData.created_at),
        isEncrypted: updatedData.is_encrypted || false,
        processing_status: updatedData.processing_status || 'idle',
        has_ideas: updatedData.has_ideas || false,
        ideas_count: updatedData.ideas_count || 0
      };
    },
    'updating transcript',
    {
      successMessage: 'Transcript updated successfully',
      errorMessage: 'Failed to update transcript',
      onSuccess: () => {
        invalidateQueries(['transcripts', user?.id]);
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
        invalidateQueries(['transcripts', user?.id]);
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
        invalidateQueries(['transcripts', user?.id]);
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
