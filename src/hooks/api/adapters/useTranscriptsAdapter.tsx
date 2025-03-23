
import { useTranscriptsApi } from '../useTranscriptsApi';
import { Document } from '@/types';
import { TranscriptProcessingResult } from '../transcripts/types';

// Backward compatibility adapter for transcripts API
export const useTranscriptsAdapter = () => {
  const {
    fetchTranscripts,
    fetchTranscriptById,
    createTranscript,
    updateTranscript,
    deleteTranscript,
    processTranscript,
    isLoading
  } = useTranscriptsApi();

  // Legacy function signatures for backward compatibility
  const getTranscripts = async (): Promise<Document[]> => {
    try {
      const result = await fetchTranscripts.refetch();
      return result.data || [];
    } catch (error) {
      console.error('Error in getTranscripts:', error);
      return [];
    }
  };

  const getTranscriptById = async (id: string): Promise<Document | null> => {
    try {
      const result = await fetchTranscriptById.refetch();
      return result.data || null;
    } catch (error) {
      console.error('Error in getTranscriptById:', error);
      return null;
    }
  };

  const addTranscript = async (data: any): Promise<Document> => {
    return createTranscript({
      title: data.title,
      content: data.content,
      type: data.type || 'transcript',
      purpose: data.purpose || 'business_context',
      isEncrypted: data.isEncrypted || false
    });
  };

  const updateTranscriptLegacy = async (id: string, data: any): Promise<Document> => {
    return updateTranscript(id, data);
  };

  const deleteTranscriptLegacy = async (id: string): Promise<boolean> => {
    return deleteTranscript(id);
  };

  const processTranscriptLegacy = async (id: string): Promise<TranscriptProcessingResult> => {
    return processTranscript(id);
  };

  return {
    getTranscripts,
    getTranscriptById,
    addTranscript,
    updateTranscript: updateTranscriptLegacy,
    deleteTranscript: deleteTranscriptLegacy,
    processTranscript: processTranscriptLegacy,
    isLoading
  };
};
