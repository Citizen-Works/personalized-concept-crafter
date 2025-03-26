import { useState, useCallback, useMemo } from 'react';
import { Document } from '@/types';
import { IdeaItem } from '../useTranscriptProcessing';
import { useTranscriptDialogs } from '../useTranscriptDialogs';
import { useTranscriptsApi } from '@/hooks/api/useTranscriptsApi';

export interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useDocumentProcessing = (
  documents: Document[] = []
) => {
  const [processingDocuments, setProcessingDocuments] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const { setIsIdeasDialogOpen } = useTranscriptDialogs();
  const { processTranscript } = useTranscriptsApi();

  // Check if processing is happening
  const isProcessing = processingDocuments.length > 0;

  // Check if a specific document is being processed
  const isDocumentProcessing = useCallback(
    (id: string) => processingDocuments.includes(id),
    [processingDocuments]
  );

  // Update the list of documents being processed
  const updateProcessingDocuments = useCallback((ids: string[]) => {
    setProcessingDocuments(ids);
  }, []);

  // Handle processing a transcript
  const handleProcessTranscript = useCallback(
    async (id: string) => {
      if (isDocumentProcessing(id)) return;

      try {
        setProcessingDocuments((prev) => [...prev, id]);
        
        // Process the transcript and get the results
        const result = await processTranscript(id);
        
        // Update the ideas state with the results
        if (result && result.ideas) {
          setIdeas(result.ideas);
          
          // Show the ideas dialog after successful processing
          setIsIdeasDialogOpen(true);
        }
        
      } catch (error) {
        console.error('Error processing document:', error);
      } finally {
        setProcessingDocuments((prev) => prev.filter((docId) => docId !== id));
      }
    },
    [isDocumentProcessing, processTranscript, setIsIdeasDialogOpen]
  );

  // Cancel processing for all documents
  const cancelProcessing = useCallback(() => {
    setProcessingDocuments([]);
  }, []);

  return useMemo(
    () => ({
      isProcessing,
      processingDocuments,
      ideas,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing
    }),
    [
      isProcessing,
      processingDocuments,
      ideas,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing
    ]
  );
};
